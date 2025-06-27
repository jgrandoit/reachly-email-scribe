
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Bot, Sparkles, ArrowLeft } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
      <CardHeader>
        <CardTitle>Your Generated Emails</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-8 md:p-12 rounded-lg border border-blue-100 min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            {/* Animated illustration */}
            <div className="relative mb-6">
              <div className="relative inline-flex items-center justify-center">
                {/* Robot/AI icon with animation */}
                <div className="relative">
                  <Bot className="w-16 h-16 text-blue-500 animate-pulse" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-indigo-500 animate-bounce" />
                  </div>
                </div>
                
                {/* Email icons floating around */}
                <div className="absolute -left-8 -top-4 animate-float">
                  <Mail className="w-6 h-6 text-blue-300" />
                </div>
                <div className="absolute -right-8 -bottom-4 animate-float" style={{ animationDelay: '1s' }}>
                  <Mail className="w-5 h-5 text-indigo-300" />
                </div>
                <div className="absolute -left-6 bottom-8 animate-float" style={{ animationDelay: '0.5s' }}>
                  <Mail className="w-4 h-4 text-purple-300" />
                </div>
              </div>
            </div>

            {/* Engaging text */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Fill out the form and let Reachly generate emails that get replies.
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span>Two unique email variations</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                <span>Different persuasion frameworks</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Optimized for responses</span>
              </div>
            </div>

            {/* Call to action hint */}
            <div className="mt-6 flex items-center justify-center gap-2 text-blue-600">
              <ArrowLeft className="w-4 h-4 rotate-180" />
              <span className="text-sm font-medium">Start with the form</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
