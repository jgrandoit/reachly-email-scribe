import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

interface PricingProps {
  onGetStarted: () => void;
}

export const Pricing = ({ onGetStarted }: PricingProps) => {
  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start for free, upgrade when you're ready to scale your outreach
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <PricingCard
          title="Free"
          price="$0"
          description="Perfect for getting started"
          features={[
            "10 emails per month",
            "2 email variants",
            "3 tone options",
            "Basic support",
          ]}
          buttonLabel="Get Started Free"
          onClick={onGetStarted}
        />

        {/* Starter Plan */}
        <PricingCard
          title="Starter"
          price="$12"
          description="per month"
          features={[
            "100 emails per month",
            "3 email variants",
            "All tone options",
            "Email performance dashboard",
            "Email support",
          ]}
          buttonLabel="Upgrade to Starter"
          highlight
          onClick={() => console.log("Upgrade to Starter")}
        />

        {/* Pro Plan */}
        <PricingCard
          title="Pro"
          price="$29"
          description="per month"
          features={[
            "Unlimited emails",
            "Advanced AI customization",
            "Performance analytics",
            "Priority support",
            "Dedicated onboarding",
          ]}
          buttonLabel="Upgrade to Pro"
          onClick={() => console.log("Upgrade to Pro")}
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
};

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonLabel,
  onClick,
  highlight,
}: CardProps) => (
  <Card
    className={`relative backdrop-blur-sm ${highlight
      ? "border-yellow-500 bg-yellow-50/70"
      : "border-gray-200 bg-white/70"
      }`}
  >
    {highlight && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <Star className="w-4 h-4" />
          <span>Best Value</span>
        </div>
      </div>
    )}
    <CardHeader className="text-center">
      <CardTitle className="text-2xl">{title}</CardTitle>
      <div className="text-4xl font-bold text-gray-900 mt-4">{price}</div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-700">
            <Check className="text-green-600 w-5 h-5" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        onClick={onClick}
        className={`w-full mt-6 ${highlight
          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
          : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
      >
        {buttonLabel}
      </Button>
    </CardContent>
  </Card>
);
