
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Sparkles, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";

export const EmailGenerator = () => {
  const [productService, setProductService] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productService,
          audience: targetAudience,
          tone,
        }),
      });

      const data = await res.json();

      if (data?.result) {
        setGeneratedEmail(data.result);
        toast({
          title: "Email Generated!",
          description: "Your cold email has been created successfully.",
        });
      } else {
        throw new Error(data?.error || "No response");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      toast({
        title: "Error",
        description: "Something went wrong while generating the email.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  setIsGenerating(true);

  // Simulate email generation (replace with actual AI call later)
  setTimeout(() => {
    const mockEmail = `Subject: Transform Your ${targetAudience} Strategy Today

Hi [Name],

I hope this email finds you well. I'm reaching out because I noticed you're in the ${targetAudience} space, and I believe our ${productService} could significantly impact your results.

Here's what makes us different:
• Proven track record with companies like yours
• ${tone === "professional" ? "Enterprise-grade" : tone === "friendly" ? "User-friendly" : "Cutting-edge"} solution
• Immediate ROI within the first month

Would you be open to a quick 15-minute call this week to explore how we can help you achieve [specific goal]?

Best regards,
[Your Name]

P.S. I'd love to share a case study of how we helped [similar company] achieve [specific result].`;

    setGeneratedEmail(mockEmail);
    setIsGenerating(false);
    toast({
      title: "Email Generated!",
      description: "Your cold email has been created successfully.",
    });
  }, 2000);
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
  setTone("");
  setGeneratedEmail("");
};

return (
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
                <Label htmlFor="tone">Email tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your email tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
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
              {generatedEmail ? (
                <div className="space-y-4">
                  <div className="bg-white/80 p-4 rounded-lg border min-h-[400px] font-mono text-sm whitespace-pre-wrap">
                    {generatedEmail}
                  </div>
                  <Button onClick={copyToClipboard} className="w-full" variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
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
);
};
