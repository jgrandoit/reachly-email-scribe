
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BarChart3, Crown, Mail, Calendar, Target, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import { useSubscription } from "@/hooks/useSubscription";
import { EmailHistory } from "./EmailHistory";
import { UsageIndicator } from "./UsageIndicator";

interface DashboardProps {
  onStartGenerator: () => void;
  onViewAnalytics: () => void;
}

interface GeneratedEmail {
  id: string;
  subject_line: string | null;
  email_content: string;
  product_service: string | null;
  target_audience: string | null;
  tone: string | null;
  framework: string | null;
  created_at: string;
}

const ADMIN_EMAIL = "blessup127@gmail.com";

export const Dashboard = ({ onStartGenerator, onViewAnalytics }: DashboardProps) => {
  const { user } = useAuth();
  const { usage, loading: usageLoading } = useUsage();
  const { subscribed, subscription_tier, createCheckout } = useSubscription();

  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleUpgrade = async () => {
    await createCheckout("starter");
  };

  const handleEditEmail = (email: GeneratedEmail) => {
    // Navigate to generator when editing an email
    onStartGenerator();
  };

  return (
    <section className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Welcome back!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Hello {user?.email}! Ready to create more powerful cold emails?
          </p>
          
          {!usageLoading && (
            <UsageIndicator usage={usage} onUpgrade={handleUpgrade} />
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Quick Actions */}
          <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Generate new emails or manage your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={onStartGenerator}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={!usage.canGenerate}
              >
                <Mail className="w-4 h-4 mr-2" />
                {usage.canGenerate ? 'Create New Email' : 'Upgrade to Generate'}
              </Button>
              
              {isAdmin && (
                <Button 
                  onClick={onViewAnalytics}
                  variant="outline" 
                  className="w-full"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              )}
              
              {!subscribed && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleUpgrade}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                This Month
              </CardTitle>
              <CardDescription>
                Your email generation activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Emails Generated</span>
                  <span className="font-semibold">{usage.current}/{usage.limit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((usage.current / usage.limit) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {usage.limit - usage.current} emails remaining
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Info */}
          <Card className="backdrop-blur-sm bg-white/60 border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {subscribed ? (
                  <Crown className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Target className="w-5 h-5 text-gray-500" />
                )}
                Current Plan
              </CardTitle>
              <CardDescription>
                {subscribed ? `${subscription_tier} Plan` : 'Free Plan'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Limit</span>
                  <span className="font-medium">{usage.limit} emails</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>AI Model</span>
                  <span className="font-medium">
                    {subscription_tier === 'pro' ? 'GPT-4' : 'GPT-4o-mini'}
                  </span>
                </div>
                {!subscribed && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={handleUpgrade}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Upgrade Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email History */}
        <EmailHistory onEditEmail={handleEditEmail} />
      </div>
    </section>
  );
};
