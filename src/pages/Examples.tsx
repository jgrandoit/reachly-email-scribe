
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Examples = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const exampleEmails = [
    {
      id: "saas-demo",
      title: "SaaS Product Demo Request",
      framework: "AIDA",
      tone: "Professional",
      audience: "Marketing Directors",
      subject: "Quick question about [Company]'s marketing automation",
      content: `Hi [First Name],

I noticed [Company] has been growing rapidly in the [industry] space - congrats on the recent [specific achievement/news]!

I'm reaching out because I help marketing directors like yourself streamline their lead generation process. Many of our clients were struggling with manual follow-ups and saw their conversion rates increase by 40% after implementing our automation platform.

Would you be interested in a quick 15-minute demo to see how this could work for [Company]? I can show you exactly how [similar company] achieved similar results.

Best regards,
[Your name]`
    },
    {
      id: "b2b-sales",
      title: "B2B Sales Outreach",
      framework: "PAS",
      tone: "Conversational",
      audience: "CEOs",
      subject: "Reducing operational costs at [Company]",
      content: `Hey [First Name],

Running a company in today's market means every dollar counts, and I imagine you're always looking for ways to optimize operations without sacrificing quality.

Most CEOs I work with tell me their biggest pain point is managing overhead costs while maintaining growth momentum. Last month alone, operational expenses ate up 35% more budget than expected for companies in your sector.

That's exactly why I reached out. We've helped similar companies reduce operational costs by 25-30% while actually improving efficiency. [Similar company] saved $180K in their first year with us.

Worth a quick conversation? I can share their case study and see if there's a fit for [Company].

Cheers,
[Your name]`
    },
    {
      id: "freelance-services",
      title: "Freelance Services Pitch",
      framework: "BAB",
      tone: "Friendly",
      audience: "Small Business Owners",
      subject: "Transform [Company]'s brand presence",
      content: `Hi [First Name],

I've been following [Company]'s journey and love what you're building in the [industry] space!

Before working with us, most small business owners struggle to create a consistent brand presence across all their marketing channels. Their messaging feels scattered, and they're not seeing the engagement they know they deserve.

After partnering with us, they have a cohesive brand story that resonates with their ideal customers. Take [client example] - after our brand overhaul, their website conversions increased by 85% and their social media engagement tripled.

I'd love to explore how we could achieve similar results for [Company]. Would you be open to a brief chat about your current brand challenges?

Best,
[Your name]`
    },
    {
      id: "consulting-services",
      title: "Consulting Services Outreach",
      framework: "STAR",
      tone: "Professional",
      audience: "VPs",
      subject: "Strategic planning challenges at [Company]",
      content: `Hello [First Name],

I hope this email finds you well. I'm reaching out because I specialize in helping VPs navigate complex strategic planning challenges.

The situation many organizations face today is the need to adapt quickly to market changes while maintaining operational excellence. Traditional planning methods often fall short in this dynamic environment.

In my recent project with [similar company], we tackled similar challenges by implementing an agile strategic framework. The result? They reduced planning cycles by 50% while improving execution accuracy by 60%.

I believe [Company] could benefit from a similar approach. Would you be interested in discussing your current strategic planning process and exploring potential improvements?

Looking forward to hearing from you.

Best regards,
[Your name]`
    }
  ];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "Copied to clipboard!",
        description: "The email content has been copied successfully.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying the text manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
              Cold Email Examples
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get inspired by these high-converting cold email templates across different industries and frameworks
            </p>
          </div>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {exampleEmails.map((email) => (
            <Card key={email.id} className="bg-white/60 backdrop-blur-sm border border-blue-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {email.title}
                  </CardTitle>
                  <Button
                    onClick={() => copyToClipboard(email.content, email.id)}
                    variant="outline"
                    size="sm"
                    className="self-start sm:self-auto"
                  >
                    {copiedId === email.id ? (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedId === email.id ? "Copied!" : "Copy Email"}
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{email.framework} Framework</Badge>
                  <Badge variant="outline">{email.tone} Tone</Badge>
                  <Badge variant="outline">Target: {email.audience}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Subject Line:</h4>
                  <p className="text-gray-700 font-medium bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {email.subject}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email Content:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <pre className="whitespace-pre-wrap text-gray-700 text-sm font-mono leading-relaxed">
                      {email.content}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="bg-white/60 backdrop-blur-sm border border-blue-200 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Create Your Own?
              </h3>
              <p className="text-gray-600 mb-6">
                Use these examples as inspiration and let our AI help you craft the perfect cold email for your specific needs.
              </p>
              <Button 
                onClick={() => window.location.href = "/"}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Generate Your Email Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Examples;
