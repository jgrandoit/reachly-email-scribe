import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, AlertTriangle, Crown, Mail, Bot, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import { useSubscription } from "@/hooks/useSubscription";
import { ProtectedRoute } from "./ProtectedRoute";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { generateDualPrompts } from "@/utils/promptGenerator";
import { DualEmailPreview } from "./DualEmailPreview";
import { UsageIndicator } from "./UsageIndicator";
import { EmptyState } from "./EmptyState";

const industryPrompts = [
  { value: "saas", label: "SaaS & Tech", prompt: "SaaS platform for project management that helps teams collaborate more efficiently" },
  { value: "agency", label: "Marketing Agency", prompt: "Digital marketing services specializing in social media and content marketing" },
  { value: "recruiting", label: "Recruiting", prompt: "Executive search and talent acquisition services for tech companies" },
  { value: "consulting", label: "Consulting", prompt: "Business strategy consulting focused on operational efficiency" },
  { value: "ecommerce", label: "E-commerce", prompt: "E-commerce optimization services to increase conversion rates" },
  { value: "finance", label: "Finance", prompt: "Financial planning and investment advisory services" },
  { value: "custom", label: "Custom", prompt: "" }
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "bold", label: "Bold" }
];

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any) => {
  if (error.code === 'USAGE_LIMIT_EXCEEDED') {
    return {
      title: "Usage Limit Exceeded",
      description: "You've reached your monthly email generation limit. Please upgrade to continue.",
      variant: "destructive" as const
    };
  }
  
  if (error.code === 'MISSING_API_KEY') {
    return {
      title: "Service Configuration Issue",
      description: "Our email generation service is temporarily unavailable. Please try again later.",
      variant: "destructive" as const
    };
  }
  
  if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
    return {
      title: "Server is Busy",
      description: "Our servers are experiencing high demand. Please try again in a few minutes.",
      variant: "destructive" as const
    };
  }
  
  if (error.message?.includes('API key') || error.message?.includes('Invalid authentication')) {
    return {
      title: "Service Temporarily Unavailable",
      description: "We're experiencing technical difficulties. Please try again later.",
      variant: "destructive" as const
    };
  }
  
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return {
      title: "Connection Issue",
      description: "Please check your internet connection and try again.",
      variant: "destructive" as const
    };
  }
  
  // Generic fallback for any other errors
  return {
    title: "Server is Busy",
    description: "We're experiencing high demand right now. Please try again in a few moments.",
    variant: "destructive" as const
  };
};

export const EmailGenerator = () => {
  const [productService, setProductService] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [customHook, setCustomHook] = useState("");
  const [emailA, setEmailA] = useState("");
  const [emailB, setEmailB] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { usage, loading: usageLoading, refreshUsage } = useUsage();
  const { createCheckout } = useSubscription();

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    const prompt = industryPrompts.find(p => p.value === industry)?.prompt || "";
    if (prompt && industry !== "custom") {
      setProductService(prompt);
    }
  };

  const handleUpgrade = async () => {
    await createCheckout("starter");
  };

  const handleGenerate = async () => {
    // Strict frontend validation for free tier
    if (!usage.canGenerate) {
      const limitMessage = usage.tier === 'free' 
        ? `You've reached your free plan limit of ${usage.limit} emails this month. Upgrade to continue generating emails!`
        : `You've reached your monthly limit of ${usage.limit} emails. Upgrade to generate more!`;
      
      toast({
        title: "Usage Limit Reached",
        description: limitMessage,
        variant: "destructive",
      });
      return;
    }

    if (!productService || !targetAudience || !selectedTone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate your emails.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setEmailA("");
    setEmailB("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Generate dual prompts for different approaches
      const { promptA, promptB } = generateDualPrompts({
        framework: 'dual',
        tone: selectedTone,
        customHook: customHook,
        product: productService,
        audience: targetAudience,
        tier: usage.tier
      });

      // Generate both emails concurrently
      const [resA, resB] = await Promise.all([
        supabase.functions.invoke('generate-email', {
          body: { prompt: promptA },
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }),
        supabase.functions.invoke('generate-email', {
          body: { prompt: promptB },
          headers: { Authorization: `Bearer ${session?.access_token}` },
        })
      ]);

      // Handle errors from either response
      if (resA.error || resB.error) {
        const error = resA.error || resB.error;
        const errorMessage = getErrorMessage(error);
        
        toast({
          title: errorMessage.title,
          description: errorMessage.description,
          variant: errorMessage.variant,
        });
        return;
      }

      if (resA.data?.result && resB.data?.result) {
        setEmailA(resA.data.result);
        setEmailB(resB.data.result);
        toast({
          title: "Emails Generated!",
          description: "Two email variations have been created successfully.",
        });
        // Refresh usage after successful generation
        await refreshUsage();
      } else {
        throw new Error("No response from API");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      const errorMessage = getErrorMessage(err);
      
      toast({
        title: errorMessage.title,
        description: errorMessage.description,
        variant: errorMessage.variant,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setProductService("");
    setTargetAudience("");
    setSelectedIndustry("");
    setSelectedTone("professional");
    setCustomHook("");
    setEmailA("");
    setEmailB("");
  };

  const regenerateEmails = () => {
    if (!productService || !targetAudience || !selectedTone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to regenerate your emails.",
        variant: "destructive",
      });
      return;
    }
    handleGenerate();
  };

  return (
    <TooltipProvider>
      <ProtectedRoute>
        <section className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <Button variant="ghost" onClick={() => window.location.reload()} className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                AI Email Generator
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-2">
                Welcome back, {user?.email}! Generate two unique cold email variations with different approaches.
              </p>
              
              {/* Usage Indicator */}
              {!usageLoading && (
                <UsageIndicator usage={usage} onUpgrade={handleUpgrade} />
              )}
            </div>

            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Input Form */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      Email Details
                      {usage.tier !== 'free' && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      Configure your outreach details to generate two unique email variations
                      {usage.tier === 'free' && (
                        <span className="block mt-2 text-sm text-orange-600">
                          Free plan: {usage.current}/{usage.limit} emails used this month
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Industry Template */}
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry Template (Optional)</Label>
                      <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an industry template" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryPrompts.map((industry) => (
                            <SelectItem key={industry.value} value={industry.value}>
                              {industry.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Product/Service */}
                    <div className="space-y-2">
                      <Label htmlFor="product">What are you selling?</Label>
                      <Textarea
                        id="product"
                        placeholder="e.g., SaaS platform for project management, digital marketing services, consulting..."
                        value={productService}
                        onChange={(e) => setProductService(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                      <Label htmlFor="audience">Who are you targeting?</Label>
                      <Input
                        id="audience"
                        placeholder="e.g., startup founders, marketing managers, HR directors..."
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>

                    {/* Email Tone */}
                    <div className="space-y-2">
                      <Label htmlFor="tone">Email Tone</Label>
                      <Select value={selectedTone} onValueChange={setSelectedTone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose email tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone.value} value={tone.value}>
                              {tone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Personal Hook */}
                    <div className="space-y-2">
                      <Label htmlFor="customHook">Personal Hook (Optional)</Label>
                      <Input
                        id="customHook"
                        placeholder="e.g., I noticed your recent LinkedIn post about scaling your team..."
                        value={customHook}
                        onChange={(e) => setCustomHook(e.target.value)}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !usage.canGenerate}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 min-h-[44px]"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Generating...
                          </>
                        ) : !usage.canGenerate ? (
                          <>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {usage.tier === 'free' ? 'Free Limit Reached' : 'Limit Reached'}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate 2 Emails
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={resetForm} className="sm:w-auto w-full">
                        Reset
                      </Button>
                    </div>

                    {/* Usage Limit Alert */}
                    {!usage.canGenerate && (
                      <Alert>
                        <Crown className="h-4 w-4" />
                        <AlertDescription>
                          {usage.tier === 'free' ? (
                            <>
                              You've used all 10 free emails this month.{' '}
                              <Button 
                                variant="link" 
                                className="p-0 ml-1 h-auto text-blue-600"
                                onClick={handleUpgrade}
                              >
                                Upgrade to Starter ($12/month) for 50 emails
                              </Button>
                            </>
                          ) : (
                            <>
                              You've reached your monthly limit.{' '}
                              <Button 
                                variant="link" 
                                className="p-0 ml-1 h-auto"
                                onClick={handleUpgrade}
                              >
                                Upgrade to generate more emails
                              </Button>
                            </>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Email Preview Area */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                {isGenerating ? (
                  <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
                    <CardHeader>
                      <CardTitle>Generating Your Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50/80 p-8 rounded-lg border min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">Generating two unique email variations...</p>
                          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : emailA || emailB ? (
                  <DualEmailPreview
                    emailA={emailA}
                    emailB={emailB}
                    productService={productService}
                    targetAudience={targetAudience}
                    tone={selectedTone}
                    customHook={customHook}
                    onRegenerate={regenerateEmails}
                    canRegenerate={usage.canGenerate}
                  />
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </TooltipProvider>
  );
};
