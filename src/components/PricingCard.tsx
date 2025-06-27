
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: Array<{ icon: any; text: string }>;
  buttonLabel: string;
  onClick: () => void;
  highlight?: boolean;
  mostPopular?: boolean;
  buttonVariant?: "primary" | "outline" | "gradient";
  isCurrentPlan?: boolean;
  disabled?: boolean;
};

export const PricingCard = ({
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
}: PricingCardProps) => (
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
            <feature.icon className="text-blue-600 w-5 h-5 flex-shrink-0" />
            <span>{feature.text}</span>
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
