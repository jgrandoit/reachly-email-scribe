
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, ArrowLeft, Mail, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const EmailGenerator = () => {
  const [formData, setFormData] = useState({
    product: "",
    audience: "",
    tone: ""
  });
  const [generatedEmails, setGeneratedEmails] = useState<Array<{subject: string, body: string}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailsGenerated, setEmailsGenerated] = useState(7); // Mock counter
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.product || !formData.audience || !formData.tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating emails.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock generated emails
    const mockEmails = [
      {
        subject: `Quick question about ${formData.product.split(' ')[0]} at [Company Name]`,
        body: `Hi [First Name],

I noticed you're working at [Company Name] and thought you might be interested in ${formData.product}.

${formData.tone === 'friendly' ? 'I\'d love to chat about' : formData.tone === 'professional' ? 'I wanted to discuss' : 'This could revolutionize'} how ${formData.audience} ${formData.tone === 'friendly' ? 'can benefit from' : formData.tone === 'professional' ? 'utilize' : 'dominate with'} our solution.

${formData.tone === 'friendly' ? 'Would you be up for a quick 15-minute call this week?' : formData.tone === 'professional' ? 'Would you be available for a brief conversation to explore this opportunity?' : 'Ready to see results that will blow your mind?'}

Best regards,
[Your Name]`
      },
      {
        subject: `${formData.tone === 'bold' ? '🚀 ' : ''}${formData.product} for ${formData.audience} - 2 minute read`,
        body: `Hello [First Name],

${formData.tone === 'friendly' ? 'Hope you\'re having a great day!' : formData.tone === 'professional' ? 'I trust this message finds you well.' : 'I\'ve got something that\'ll grab your attention.'}

${formData.tone === 'friendly' ? 'I came across your profile and thought' : formData.tone === 'professional' ? 'Based on your role at [Company Name], I believe' : 'Your company needs'} ${formData.product} ${formData.tone === 'friendly' ? 'might be exactly what you need' : formData.tone === 'professional' ? 'could provide significant value' : 'and I can prove it'}.

Specifically for ${formData.audience}, we've seen:
• ${formData.tone === 'friendly' ? 'Amazing improvements' : formData.tone === 'professional' ? 'Measurable enhancements' : 'Game-changing results'}
• ${formData.tone === 'friendly' ? 'Great time savings' : formData.tone === 'professional' ? 'Operational efficiency gains' : 'Massive productivity boosts'}

${formData.tone === 'friendly' ? 'Interested in learning more?' : formData.tone === 'professional' ? 'I would welcome the opportunity to discuss this further.' : 'Ready to see what this can do for you?'}

${formData.tone === 'friendly' ? 'Cheers' : formData.tone === 'professional' ? 'Sincerely' : 'Let\'s make it happen'},
[Your Name]`
      }
    ];
    
    setGeneratedEmails(mockEmails);
    setEmailsGenerated(prev => prev + 1);
    setIsGenerating(false);
    
    toast({
      title: "Emails Generated!",
      description: "Your cold emails are ready to copy and send."
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard."
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Email Generator
          </h1>
          <div className="text-sm text-gray-500">
            {emailsGenerated}/10 emails used this month
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Generate Your Cold Email</span>
            </CardTitle>
            <CardDescription>
              Tell us about your product and audience, and we'll craft the perfect cold email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product">What are you promoting?</Label>
              <Textarea
                id="product"
                placeholder="e.g., AI-powered project management software that helps teams collaborate 50% faster..."
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audience">Who is your target audience?</Label>
              <Textarea
                id="audience"
                placeholder="e.g., CTOs at mid-size tech companies, startup founders, marketing directors..."
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Email tone</Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your email tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly & Casual</SelectItem>
                  <SelectItem value="professional">Professional & Formal</SelectItem>
                  <SelectItem value="bold">Bold & Direct</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Generate Emails
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* Generated Emails */}
        <div className="space-y-6">
          {generatedEmails.length === 0 ? (
            <Card className="bg-white/50 backdrop-blur-sm border-dashed border-2 border-gray-300">
              <CardContent className="py-16 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to Generate</h3>
                <p className="text-gray-500">Fill out the form and click generate to see your AI-powered cold emails</p>
              </CardContent>
            </Card>
          ) : (
            generatedEmails.map((email, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Email Variant {index + 1}</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Subject Line:</Label>
                    <div className="mt-1 p-3 bg-blue-50 rounded border border-blue-200 text-sm">
                      {email.subject}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email Body:</Label>
                    <div className="mt-1 p-4 bg-gray-50 rounded border border-gray-200 text-sm whitespace-pre-wrap font-mono">
                      {email.body}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
