
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTestMode } from "@/hooks/useTestMode";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailAnalyzerProps {
  email: string;
  emailType: string; // "A" or "B"
  isPro: boolean;
  onUpgrade: () => void;
}

interface AnalysisResult {
  overall_score: number;
  tone_score: number;
  structure_score: number;
  clarity_score: number;
  spam_score: number;
  suggestions: string[];
  strengths: string[];
  red_flags: string[];
}

export const EmailAnalyzer = ({ email, emailType, isPro, onUpgrade }: EmailAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isTestMode, testTier } = useTestMode();

  // In test mode, override isPro based on test tier
  const effectiveIsPro = isTestMode ? (testTier === 'pro') : isPro;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const handleAnalyze = async () => {
    if (!effectiveIsPro) {
      toast({
        title: "Pro Feature",
        description: "Email analysis is available for Pro users. Upgrade to unlock detailed scoring and AI suggestions!",
        variant: "default",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "No Email to Analyze",
        description: "Please generate an email first before analyzing it.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Build URL with test mode parameters if active
      let functionUrl = 'analyze-email';
      if (isTestMode && testTier) {
        functionUrl += `?test=true&tier=${testTier}`;
      }
      
      const response = await supabase.functions.invoke(functionUrl, {
        body: { 
          email_content: email,
          email_type: emailType 
        },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      console.log('Analysis response:', response);

      if (response.error) {
        console.error('Analysis error:', response.error);
        throw new Error(response.error.message || 'Analysis failed');
      }

      if (response.data?.analysis) {
        setAnalysis(response.data.analysis);
        toast({
          title: "Analysis Complete!",
          description: `Email ${emailType} scored ${response.data.analysis.overall_score}/100`,
        });
      } else {
        console.error('No analysis data:', response.data);
        throw new Error("No analysis data received");
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({
        title: "Analysis Failed",
        description: err.message || "Unable to analyze the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!effectiveIsPro) {
    return (
      <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Crown className="w-5 h-5" />
            AI Email Analyzer - Pro Feature
            {isTestMode && (
              <Badge variant="secondary" className="ml-2">
                Test Mode: {testTier?.toUpperCase()}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-yellow-700">
              Get detailed analysis of your cold emails with AI-powered scoring and improvement suggestions.
            </p>
            <div className="bg-white/60 p-4 rounded-lg border border-yellow-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-yellow-600" />
                  <span>Cold Email Score (0-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-600" />
                  <span>Tone & Structure Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span>Spam Risk Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <span>AI Improvement Suggestions</span>
                </div>
              </div>
            </div>
            <Button onClick={onUpgrade} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro for Email Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-blue-700">
            <TrendingUp className="w-5 h-5" />
            AI Email Analysis - Option {emailType}
          </span>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            {isTestMode && (
              <Badge variant="secondary">
                Test: {testTier?.toUpperCase()}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && (
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing with GPT-4o...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze Email Quality
              </>
            )}
          </Button>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-4 bg-white/60 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant={getScoreBadgeVariant(analysis.overall_score)} className="text-lg px-3 py-1">
                  {analysis.overall_score}/100
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Overall Cold Email Score</p>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tone</span>
                  <span className={getScoreColor(analysis.tone_score)}>{analysis.tone_score}/100</span>
                </div>
                <Progress value={analysis.tone_score} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Structure</span>
                  <span className={getScoreColor(analysis.structure_score)}>{analysis.structure_score}/100</span>
                </div>
                <Progress value={analysis.structure_score} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Clarity</span>
                  <span className={getScoreColor(analysis.clarity_score)}>{analysis.clarity_score}/100</span>
                </div>
                <Progress value={analysis.clarity_score} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spam Risk</span>
                  <span className={analysis.spam_score > 70 ? "text-red-600" : analysis.spam_score > 40 ? "text-yellow-600" : "text-green-600"}>
                    {100 - analysis.spam_score}/100
                  </span>
                </div>
                <Progress value={100 - analysis.spam_score} className="h-2" />
              </div>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded border-l-2 border-green-500">
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Red Flags */}
            {analysis.red_flags.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Red Flags
                </h4>
                <ul className="space-y-1">
                  {analysis.red_flags.map((flag, index) => (
                    <li key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded border-l-2 border-red-500">
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  AI Improvement Suggestions
                </h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-blue-700 bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              onClick={handleAnalyze} 
              variant="outline" 
              className="w-full"
              disabled={isAnalyzing}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Re-analyze Email
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
