
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

interface PricingProps {
  onGetStarted: () => void;
}

export const Pricing = ({ onGetStarted }: PricingProps) => {
  const { user } = useAuth();
  const { createCheckout, openCustomerPortal, subscribed, subscription_tier, loading } = useSubscription();

  const handlePlanSelect = async (plan: string) => {
    if (!user) {
      onGetStarted();
      return;
    }

    if (plan === "free") {
      onGetStarted();
      return;
    }

    await createCheckout(plan);
  };

  const isCurrentPlan = (planTier: string) => {
    if (planTier === "free") return !subscribed;
    if (planTier === "starter") return subscription_tier === "Starter";
    if (planTier === "pro") return subscription_tier === "Pro";
    return false;
  };

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start for free, upgrade when you're ready to scale your outreach
        </p>
        {subscribed && (
          <div className="mt-4">
            <Button
              onClick={openCustomerPortal}
              variant="outline"
              disabled={loading}
              className="mr-4"
            >
              Manage Subscription
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Current plan: {subscription_tier || "Free"}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <PricingCard
          title="Free"
          price="$0"
          description="Perfect for getting started"
          features={[
            "10 emails per month",
            "2 email variants per generation",
            "4 tone options",
            "Industry templates",
            "Basic support",
          ]}
          buttonLabel={isCurrentPlan("free") ? "Current Plan" : "Get Started Free"}
          onClick={() => handlePlanSelect("free")}
          buttonVariant="outline"
          isCurrentPlan={isCurrentPlan("free")}
          disabled={isCurrentPlan("free") || loading}
        />

        {/* Starter Plan */}
        <PricingCard
          title="Starter"
          price="$12"
          description="per month • Ideal for growing outreach"
          features={[
            "50 emails per month",
            "3 email variants per generation",
            "All tone options",
            "Industry templates",
            "Priority support",
          ]}
          buttonLabel={isCurrentPlan("starter") ? "Current Plan" : "Choose Starter"}
          onClick={() => handlePlanSelect("starter")}
          buttonVariant="primary"
          isCurrentPlan={isCurrentPlan("starter")}
          disabled={isCurrentPlan("starter") || loading}
        />

        {/* Pro Plan */}
        <PricingCard
          title="Pro"
          price="$29"
          description="per month • Best for scaling campaigns"
          features={[
            "Unlimited emails",
            "5 email variants per generation",
            "All tone options",
            "Industry templates",
            "Priority support",
            "Advanced AI features",
          ]}
          buttonLabel={isCurrentPlan("pro") ? "Current Plan" : "Upgrade to Pro"}
          onClick={() => handlePlanSelect("pro")}
          highlight
          mostPopular
          isCurrentPlan={isCurrentPlan("pro")}
          disabled={isCurrentPlan("pro") || loading}
        />
      </div>
    </section>
  );
};

type CardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonLabel: string;
  onClick: () => void;
  highlight?: boolean;
  mostPopular?: boolean;
  buttonVariant?: "primary" | "outline" | "gradient";
  isCurrentPlan?: boolean;
  disabled?: boolean;
};

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonLabel,
  onClick,
  highlight,
  mostPopular,
  buttonVariant = "primary",
  isCurrentPlan,
  disabled,
}: CardProps) => (
  <Card
    className={`relative backdrop-blur-sm ${
      isCurrentPlan
        ? "border-green-500 bg-green-50/70 scale-105"
        : highlight || mostPopular
        ? "border-blue-500 bg-blue-50/70 scale-105"
        : "border-gray-200 bg-white/70"
    }`}
  >
    {mostPopular && !isCurrentPlan && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <Star className="w-4 h-4" />
          <span>Most Popular</span>
        </div>
      </div>
    )}
    {isCurrentPlan && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <Check className="w-4 h-4" />
          <span>Your Plan</span>
        </div>
      </div>
    )}
    <CardHeader className="text-center">
      <CardTitle className="text-2xl">{title}</CardTitle>
      <div className="text-4xl font-bold text-gray-900 mt-4">{price}</div>
      <CardDescription className="text-gray-600">{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-gray-700">
            <Check className="text-green-600 w-5 h-5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`w-full mt-6 ${
          isCurrentPlan
            ? "bg-green-600 hover:bg-green-700 text-white cursor-default"
            : buttonVariant === "outline"
            ? "bg-white border border-gray-300 hover:bg-gray-100 text-gray-900"
            : buttonVariant === "gradient" || mostPopular
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {buttonLabel}
      </Button>
    </CardContent>
  </Card>
);
