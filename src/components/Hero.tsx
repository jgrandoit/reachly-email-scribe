
import { Button } from "@/components/ui/button";
import { Mail, Sparkles, Zap } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  const handleSeeExamples = () => {
    window.location.href = "/examples";
  };

  return (
    <section className="container mx-auto px-4 pt-20 pb-16 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">AI-Powered Cold Email Generator</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
          Write Perfect Cold Emails in
          <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            30 Seconds
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Stop struggling with cold outreach. Reachly's AI writes personalized, high-converting emails 
          that get responses. Just describe what you're selling and who you're targeting.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3 h-14"
          >
            <Zap className="w-5 h-5 mr-2" />
            Generate Your First Email
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-3 h-14"
            onClick={handleSeeExamples}
          >
            <Mail className="w-5 h-5 mr-2" />
            See Examples
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          ✨ 10 free emails • No credit card required • Ready in seconds
        </div>
      </div>
    </section>
  );
};
