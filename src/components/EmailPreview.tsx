
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ThumbsUp, Wrench, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface EmailPreviewProps {
  generatedEmail: string;
  framework: string;
  tone: string;
  productService: string;
  targetAudience: string;
  customHook: string;
  onRegenerate: () => void;
  canRegenerate: boolean;
}

export const EmailPreview = ({
  generatedEmail,
  framework,
  tone,
  productService,
  targetAudience,
  customHook,
  onRegenerate,
  canRegenerate
}: EmailPreviewProps) => {
  const [isRating, setIsRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard.",
    });
  };

  const handleRating = async (rating: 'useful' | 'needs_work') => {
    if (!user || hasRated) return;
    
    setIsRating(true);
    
    try {
      const { error } = await supabase
        .from('email_ratings')
        .insert({
          user_id: user.id,
          email_content: generatedEmail,
          framework,
          tone,
          product_service: productService,
          target_audience: targetAudience,
          custom_hook: customHook || null,
          rating
        });

      if (error) throw error;

      setHasRated(true);
      toast({
        title: "Thank you!",
        description: rating === 'useful' 
          ? "Your feedback helps us improve our AI!" 
          : "Thanks for the feedback - we'll use this to make better emails!",
      });
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Error",
        description: "Failed to save your rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRating(false);
    }
  };

  if (!generatedEmail) {
    return (
      <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
        <CardHeader>
          <CardTitle>Your Generated Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50/80 p-8 rounded-lg border min-h-[400px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Configure your settings and generate your email to see the preview here.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
      <CardHeader>
        <CardTitle>Your Generated Email</CardTitle>
        <p className="text-sm text-gray-600">
          Preview your email and rate the quality to help improve our AI
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white/80 p-4 rounded-lg border min-h-[400px] font-mono text-sm whitespace-pre-wrap">
          {generatedEmail}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={copyToClipboard} className="flex-1" variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
          <Button 
            onClick={onRegenerate} 
            variant="outline"
            disabled={!canRegenerate}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>

        {/* Rating Section */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">How would you rate this email?</p>
          <div className="flex gap-3">
            <Button
              onClick={() => handleRating('useful')}
              disabled={isRating || hasRated}
              variant={hasRated ? "secondary" : "outline"}
              className="flex-1"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              🔥 Useful
            </Button>
            <Button
              onClick={() => handleRating('needs_work')}
              disabled={isRating || hasRated}
              variant={hasRated ? "secondary" : "outline"}
              className="flex-1"
            >
              <Wrench className="w-4 h-4 mr-2" />
              🛠 Needs work
            </Button>
          </div>
          {hasRated && (
            <p className="text-xs text-green-600 mt-2 text-center">
              ✅ Thanks for your feedback!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
