
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

interface PricingCardProps {
  plan: {
    id: string;
    title: string;
    price: string;
    description: string;
    features: {
      icon: React.FC<{ className?: string }>;
      text: string;
      note?: string;
      highlight?: boolean;
    }[];
    buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
    mostPopular?: boolean;
    highlight?: boolean;
  };
  onUpgrade: (planId: string) => void;
}

export const PricingCard = ({ plan, onUpgrade }: PricingCardProps) => {
  const { subscribed, subscription_tier } = useSubscription();
  
  const isCurrentPlan = subscribed && 
    subscription_tier?.toLowerCase() === plan.id.toLowerCase();

  // Map "primary" to "default" for shadcn/ui Button compatibility
  const getButtonVariant = (variant?: string) => {
    if (variant === "primary") return "default";
    return variant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | undefined;
  };

  return (
    <Card className={`relative ${plan.highlight ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
      {plan.mostPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold">{plan.title}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{plan.price}</span>
          {plan.price !== "$0" && <span className="text-gray-600">/month</span>}
        </div>
        <CardDescription className="mt-2">{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <feature.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                feature.highlight ? 'text-yellow-500' : 'text-green-500'
              }`} />
              <div className="flex-1">
                <span className={`text-sm ${feature.highlight ? 'font-semibold text-yellow-700' : ''}`}>
                  {feature.text}
                </span>
                {feature.note && (
                  <div className={`text-xs mt-1 ${
                    feature.highlight 
                      ? 'text-yellow-600 font-medium' 
                      : 'text-gray-500'
                  }`}>
                    ({feature.note})
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        
        <Button 
          className="w-full" 
          variant={getButtonVariant(plan.buttonVariant)}
          onClick={() => onUpgrade(plan.id)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : `Choose ${plan.title}`}
        </Button>
      </CardContent>
    </Card>
  );
};
