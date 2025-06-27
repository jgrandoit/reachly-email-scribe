
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, Crown, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

interface DashboardProps {
  onStartGenerator: () => void;
}

export const Dashboard = ({ onStartGenerator }: DashboardProps) => {
  const { user } = useAuth();
  const { subscribed, subscription_tier, createCheckout, openCustomerPortal } = useSubscription();

  // Mock data for emails generated this month (you can replace with real data)
  const emailsGenerated = 3;
  const emailLimit = subscribed ? (subscription_tier === "Pro" ? "Unlimited" : 50) : 10;
  const progressValue = typeof emailLimit === "number" ? (emailsGenerated / emailLimit) * 100 : 30;

  const handleUpgrade = async () => {
    if (subscription_tier === "Starter") {
      await createCheckout("pro");
    } else {
      await createCheckout("starter");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Your AI-powered cold email generation dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
              <div className="text-2xl font-bold text-green-600 mb-1">
                {emailsGenerated}
                {typeof emailLimit === "number" && (
                  <span className="text-sm text-gray-500 font-normal">
                    /{emailLimit}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {typeof emailLimit === "number" 
                  ? `${emailLimit - emailsGenerated} emails remaining`
                  : "Unlimited emails"
                }
              </p>
              {typeof emailLimit === "number" && (
                <Progress value={progressValue} className="h-2" />
              )}
            </CardContent>
          </Card>

          {/* Quick Action */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Generate your next cold email in seconds
              </p>
              <Button
                onClick={onStartGenerator}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Create Email
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Section for Free Users */}
        {!subscribed && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
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
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">Starter Plan - $12/mo</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 50 emails per month</li>
                    <li>• 3 email variants per generation</li>
                    <li>• All tone options</li>
                  </ul>
                </div>
                <div className="flex-1">
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
                  className="flex-1"
                >
                  Choose Starter
                </Button>
                <Button
                  onClick={() => createCheckout("pro")}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
