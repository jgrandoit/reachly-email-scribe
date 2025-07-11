
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { PricingCard } from "./PricingCard";
import { pricingPlans } from "./PricingPlans";

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

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight py-2">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onUpgrade={handlePlanSelect}
          />
        ))}
      </div>
    </section>
  );
};
