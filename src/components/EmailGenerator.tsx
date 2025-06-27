import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Sparkles, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

const industryPrompts = [
  { value: "saas", label: "SaaS & Tech", prompt: "SaaS platform for project management that helps teams collaborate more efficiently" },
  { value: "agency", label: "Marketing Agency", prompt: "Digital marketing services specializing in social media and content marketing" },
  { value: "recruiting", label: "Recruiting", prompt: "Executive search and talent acquisition services for tech companies" },
  { value: "consulting", label: "Consulting", prompt: "Business strategy consulting focused on operational efficiency" },
  { value: "ecommerce", label: "E-commerce", prompt: "E-commerce optimization services to increase conversion rates" },
  { value: "finance", label: "Finance", prompt: "Financial planning and investment advisory services" },
  { value: "custom", label: "Custom", prompt: "" }
];

const toneOptions = [
  { 
    value: "professional", 
    label: "Professional",
    tooltip: "Formal, business-focused tone. Best for B2B and enterprise clients."
  },
  { 
    value: "friendly", 
    label: "Friendly",
    tooltip: "Warm and approachable tone. Great for building rapport and trust."
  },
  { 
    value: "casual", 
    label: "Casual",
    tooltip: "Relaxed, conversational tone. Works well for creative industries."
  },
  { 
    value: "direct", 
    label: "Direct",
    tooltip: "Straight to the point. Perfect when time is limited."
  }
];

export const EmailGenerator = () => {
  const [productService, setProductService] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    const prompt = industryPrompts.find(p => p.value === industry)?.prompt || "";
    if (prompt && industry !== "custom") {
      setProductService(prompt);
    }
  };

  const handleGenerate = async () => {
    if (!productService || !targetAudience || !tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate your email.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedEmail("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await supabase.functions.invoke('generate-email', {
        body: {
          product: productService,
          audience: targetAudience,
          tone,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (res.error) {
        throw new Error(res.error.message || 'Failed to generate email');
      }

      if (res.data?.result) {
        setGeneratedEmail(res.data.result);
        toast({
          title: "Email Generated!",
          description: "Your cold email has been created successfully.",
        });
      } else {
        throw new Error("No response from API");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      toast({
        title: "Generation Failed",
        description: err.message || "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard.",
    });
  };

  const resetForm = () => {
    setProductService("");
    setTargetAudience("");
    setTone("professional");
    setSelectedIndustry("");
    setGeneratedEmail("");
  };

  const regenerateEmail = () => {
    if (!productService || !targetAudience || !tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to regenerate your email.",
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Button variant="ghost" onClick={() => window.location.reload()} className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                AI Email Generator
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Welcome back, {user?.email}! Generate personalized cold emails in seconds.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Email Details
                  </CardTitle>
                  <CardDescription>
                    Provide details about your product/service and target audience
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
                    <div className="flex items-center gap-2">
                      <Label htmlFor="tone">Email tone</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose the tone that best fits your audience and industry</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your email tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <Tooltip>
                              <TooltipTrigger className="w-full text-left">
                                {option.label}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{option.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Email
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Email */}
              <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
                <CardHeader>
                  <CardTitle>Your Generated Email</CardTitle>
                  <CardDescription>
                    {generatedEmail ? "Copy and customize as needed" : "Your email will appear here"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="bg-gray-50/80 p-8 rounded-lg border min-h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Generating your personalized email...</p>
                      </div>
                    </div>
                  ) : generatedEmail ? (
                    <div className="space-y-4">
                      <div className="bg-white/80 p-4 rounded-lg border min-h-[400px] font-mono text-sm whitespace-pre-wrap">
                        {generatedEmail}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={copyToClipboard} className="flex-1" variant="outline">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </Button>
                        <Button onClick={regenerateEmail} variant="outline">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50/80 p-8 rounded-lg border min-h-[400px] flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Fill out the form and click "Generate Email" to see your personalized cold email here.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </TooltipProvider>
  );
};
