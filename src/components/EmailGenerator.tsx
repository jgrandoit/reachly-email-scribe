
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, AlertTriangle, Crown } from "lucide-react";
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
    if (!usage.canGenerate) {
      toast({
        title: "Usage Limit Reached",
        description: `You've reached your monthly limit of ${usage.limit} emails. Upgrade to generate more!`,
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

      if (resA.error || resB.error) {
        const error = resA.error || resB.error;
        if (error.code === 'USAGE_LIMIT_EXCEEDED') {
          toast({
            title: "Usage Limit Exceeded",
            description: `You've used all ${usage.limit} emails for this month. Upgrade to generate more!`,
            variant: "destructive",
          });
          return;
        }
        throw new Error(error.message || 'Failed to generate emails');
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
      toast({
        title: "Generation Failed",
        description: err.message || "Failed to generate emails. Please try again.",
        variant: "destructive",
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
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Button variant="ghost" onClick={() => window.location.reload()} className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                AI Email Generator
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Welcome back, {user?.email}! Generate two unique cold email variations with different approaches.
              </p>
              
              {/* Usage Display */}
              {!usageLoading && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Monthly Usage ({usage.tier})
                    </span>
                    <span className="text-sm font-medium">
                      {usage.current} / {usage.limit === -1 ? '∞' : usage.limit}
                    </span>
                  </div>
                  {usage.limit !== -1 && (
                    <Progress value={usage.percentage} className="h-2 mb-2" />
                  )}
                  {usage.percentage > 80 && usage.limit !== -1 && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        You're running low on emails. 
                        <Button 
                          variant="link" 
                          className="p-0 ml-1 h-auto text-blue-600"
                          onClick={handleUpgrade}
                        >
                          Upgrade now
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Input Form */}
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      Email Details
                      {usage.tier !== 'free' && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      Configure your outreach details to generate two unique email variations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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

                    <div className="space-y-2">
                      <Label htmlFor="product">What are you selling?</Label>
                      <Textarea
                        id="product"
                        placeholder="e.g., SaaS platform for project management, digital marketing services, consulting..."
                        value={productService}
                        onChange={(e) => setProductService(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Who are you targeting?</Label>
                      <Input
                        id="audience"
                        placeholder="e.g., startup founders, marketing managers, HR directors..."
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>

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

                    <div className="space-y-2">
                      <Label htmlFor="customHook">Personal Hook (Optional)</Label>
                      <Input
                        id="customHook"
                        placeholder="e.g., I noticed your recent LinkedIn post about scaling your team..."
                        value={customHook}
                        onChange={(e) => setCustomHook(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !usage.canGenerate}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Generating...
                          </>
                        ) : !usage.canGenerate ? (
                          <>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Limit Reached
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate 2 Emails
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        Reset
                      </Button>
                    </div>

                    {!usage.canGenerate && (
                      <Alert>
                        <Crown className="h-4 w-4" />
                        <AlertDescription>
                          You've reached your monthly limit. 
                          <Button 
                            variant="link" 
                            className="p-0 ml-1 h-auto"
                            onClick={handleUpgrade}
                          >
                            Upgrade to generate more emails
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Dual Email Preview */}
              <div className="lg:col-span-3">
                {isGenerating ? (
                  <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
                    <CardHeader>
                      <CardTitle>Generating Your Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50/80 p-8 rounded-lg border min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                          <p className="text-gray-600">Generating two unique email variations...</p>
                          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </TooltipProvider>
  );
};
