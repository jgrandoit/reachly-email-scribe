
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ThumbsUp, Wrench, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { EmailAnalyzer } from "./EmailAnalyzer";

interface DualEmailPreviewProps {
  emailA: string;
  emailB: string;
  productService: string;
  targetAudience: string;
  tone: string;
  customHook: string;
  onRegenerate: () => void;
  canRegenerate: boolean;
}

export const DualEmailPreview = ({
  emailA,
  emailB,
  productService,
  targetAudience,
  tone,
  customHook,
  onRegenerate,
  canRegenerate
}: DualEmailPreviewProps) => {
  const [ratingA, setRatingA] = useState<'useful' | 'needs_work' | null>(null);
  const [ratingB, setRatingB] = useState<'useful' | 'needs_work' | null>(null);
  const [isRating, setIsRating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscribed, subscription_tier, createCheckout } = useSubscription();

  const isPro = subscribed && subscription_tier?.toLowerCase() === 'pro';

  const copyToClipboard = (email: string, option: string) => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Copied!",
      description: `${option} copied to clipboard.`,
    });
  };

  const handleRating = async (email: string, framework: string, rating: 'useful' | 'needs_work') => {
    if (!user) return;
    
    setIsRating(true);
    
    try {
      const { error } = await supabase
        .from('email_ratings')
        .insert({
          user_id: user.id,
          email_content: email,
          framework,
          tone,
          product_service: productService,
          target_audience: targetAudience,
          custom_hook: customHook || null,
          rating
        });

      if (error) throw error;

      if (framework === 'persuasive_pitch') {
        setRatingA(rating);
      } else {
        setRatingB(rating);
      }

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

  const handleUpgrade = async () => {
    await createCheckout("pro");
  };

  if (!emailA && !emailB) {
    return (
      <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
        <CardHeader>
          <CardTitle>Your Generated Email{isPro ? 's' : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50/80 p-8 rounded-lg border min-h-[400px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Configure your settings and generate your email{isPro ? 's' : ''} to see the preview{isPro ? 's' : ''} here.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Option A - Persuasive Pitch */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-blue-600">{isPro ? 'Option A: Persuasive Pitch' : 'Your Generated Email'}</span>
                <Button 
                  onClick={onRegenerate} 
                  variant="outline" 
                  size="sm"
                  disabled={!canRegenerate}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate{isPro ? ' Both' : ''}
                </Button>
              </CardTitle>
              {isPro && (
                <p className="text-sm text-gray-600">
                  AIDA framework - Attention, Interest, Desire, Action
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 p-4 rounded-lg border min-h-[200px] font-mono text-sm whitespace-pre-wrap">
                {emailA || "Generating..."}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(emailA, isPro ? "Option A" : "Email")} 
                  className="flex-1" 
                  variant="outline"
                  disabled={!emailA}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy {isPro ? 'Option A' : 'Email'}
                </Button>
              </div>

              {emailA && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Rate this email:</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleRating(emailA, 'persuasive_pitch', 'useful')}
                      disabled={isRating || ratingA !== null}
                      variant={ratingA ? "secondary" : "outline"}
                      className="flex-1"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      🔥 Useful
                    </Button>
                    <Button
                      onClick={() => handleRating(emailA, 'persuasive_pitch', 'needs_work')}
                      disabled={isRating || ratingA !== null}
                      variant={ratingA ? "secondary" : "outline"}
                      className="flex-1"
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      🛠 Needs work
                    </Button>
                  </div>
                  {ratingA && (
                    <p className="text-xs text-green-600 mt-2 text-center">
                      ✅ Thanks for your feedback!
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Email Analyzer for Option A */}
        <div className="lg:col-span-1">
          {emailA && (
            <EmailAnalyzer 
              email={emailA} 
              emailType="A" 
              isPro={isPro}
              onUpgrade={handleUpgrade}
            />
          )}
        </div>
      </div>

      {/* Option B - Problem/Solution (Pro Only) */}
      {isPro && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
              <CardHeader>
                <CardTitle className="text-indigo-600">Option B: Problem/Solution</CardTitle>
                <p className="text-sm text-gray-600">
                  Direct approach - Problem identification and solution presentation
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/80 p-4 rounded-lg border min-h-[200px] font-mono text-sm whitespace-pre-wrap">
                  {emailB || "Generating..."}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => copyToClipboard(emailB, "Option B")} 
                    className="flex-1" 
                    variant="outline"
                    disabled={!emailB}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Option B
                  </Button>
                </div>

                {emailB && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Rate this email:</p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleRating(emailB, 'problem_solution', 'useful')}
                        disabled={isRating || ratingB !== null}
                        variant={ratingB ? "secondary" : "outline"}
                        className="flex-1"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        🔥 Useful
                      </Button>
                      <Button
                        onClick={() => handleRating(emailB, 'problem_solution', 'needs_work')}
                        disabled={isRating || ratingB !== null}
                        variant={ratingB ? "secondary" : "outline"}
                        className="flex-1"
                      >
                        <Wrench className="w-4 h-4 mr-2" />
                        🛠 Needs work
                      </Button>
                    </div>
                    {ratingB && (
                      <p className="text-xs text-green-600 mt-2 text-center">
                        ✅ Thanks for your feedback!
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Email Analyzer for Option B */}
          <div className="lg:col-span-1">
            {emailB && (
              <EmailAnalyzer 
                email={emailB} 
                emailType="B" 
                isPro={isPro}
                onUpgrade={handleUpgrade}
              />
            )}
          </div>
        </div>
      )}

      {/* Upgrade prompt for non-Pro users */}
      {!isPro && (
        <Card className="backdrop-blur-sm bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Want A/B Testing for Your Emails?
            </h3>
            <p className="text-gray-600 mb-4">
              Upgrade to Pro to generate two different email approaches and see which performs better.
            </p>
            <Button onClick={handleUpgrade} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
