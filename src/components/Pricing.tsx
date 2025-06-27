
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
            "2 email variants per generation",
            "3 tone options",
            "Basic support",
          ]}
          buttonLabel="Get Started Free"
          onClick={onGetStarted}
          buttonVariant="outline"
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
            "Email templates",
          ]}
          buttonLabel="Choose Starter"
          onClick={onGetStarted}
          buttonVariant="primary"
        />

        {/* Pro Plan */}
        <PricingCard
          title="Pro"
          price="$29"
          description="per month • Best for scaling campaigns"
          features={[
            "Unlimited emails",
            "2 email variants per generation",
            "All tone options",
            "Priority support",
            "Advanced AI features",
          ]}
          buttonLabel="Upgrade to Pro"
          onClick={onGetStarted}
          highlight
          mostPopular
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
}: CardProps) => (
  <Card
    className={`relative backdrop-blur-sm ${
      highlight || mostPopular
        ? "border-blue-500 bg-blue-50/70 scale-105"
        : "border-gray-200 bg-white/70"
    }`}
  >
    {mostPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <Star className="w-4 h-4" />
          <span>Most Popular</span>
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
        className={`w-full mt-6 ${
          buttonVariant === "outline"
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
