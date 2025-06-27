
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, Crown, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsage } from "@/hooks/useUsage";
import { EmailHistory } from "./EmailHistory";

interface DashboardProps {
  onStartGenerator: () => void;
}

export const Dashboard = ({ onStartGenerator }: DashboardProps) => {
  const { user } = useAuth();
  const { subscribed, subscription_tier, createCheckout, openCustomerPortal, loading } = useSubscription();
  const { usage, loading: usageLoading } = useUsage();

  const handleUpgrade = async () => {
    if (subscription_tier === "Starter") {
      await createCheckout("pro");
    } else {
      await createCheckout("starter");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Your AI-powered cold email generation dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Current Plan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-blue-600" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {subscription_tier || "Free"}
              </div>
              <p className="text-sm text-gray-600">
                {subscribed ? "Active subscription" : "Free tier"}
              </p>
              {subscribed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openCustomerPortal}
                  className="mt-3 w-full"
                  disabled={loading}
                >
                  Manage Plan
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Emails Generated */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Emails This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usageLoading ? (
                <div className="text-sm text-gray-500">Loading usage...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {usage.current}
                    {usage.limit !== -1 && (
                      <span className="text-sm text-gray-500 font-normal">
                        /{usage.limit}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {usage.limit === -1 
                      ? "Unlimited emails"
                      : `${Math.max(0, usage.limit - usage.current)} emails remaining`
                    }
                  </p>
                  {usage.limit !== -1 && (
                    <Progress value={usage.percentage} className="h-2" />
                  )}
                  {!usage.canGenerate && (
                    <p className="text-xs text-red-600 mt-2">
                      Monthly limit reached - upgrade to continue
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Generate Cold Email Section - Updated */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-blue-900">Generate Cold Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-1">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full mb-3">
                  ⚡ Quick Start
                </span>
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">Write Your First Email</h3>
              <p className="text-sm text-blue-700 mb-4">
                Generate your next cold email in seconds
              </p>
              <Button
                onClick={onStartGenerator}
                disabled={!usage.canGenerate}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
              >
                Create Email
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {!usage.canGenerate && (
                <p className="text-xs text-blue-600 mt-2 text-center">
                  Upgrade your plan to generate more emails
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Email History Section */}
        <div className="mb-10">
          <EmailHistory />
        </div>

        {/* Upgrade Section for Free Users - Enhanced styling */}
        {!subscribed && (
          <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border-blue-200 shadow-lg shadow-blue-100/50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">
                Unlock Unlimited Email Generation
              </CardTitle>
              <CardDescription className="text-blue-700">
                Upgrade to generate more emails and access premium features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Starter Plan - $12/mo</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 50 emails per month</li>
                    <li>• 3 email variants per generation</li>
                    <li>• All tone options</li>
                  </ul>
                </div>
                <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Pro Plan - $29/mo</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Unlimited emails</li>
                    <li>• 5 email variants per generation</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => createCheckout("starter")}
                  variant="outline"
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                  disabled={loading}
                >
                  Choose Starter
                </Button>
                <Button
                  onClick={() => createCheckout("pro")}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200"
                  disabled={loading}
                >
                  Choose Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
