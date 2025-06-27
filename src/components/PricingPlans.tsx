
import { Mail, Users, TrendingUp, Star, Headphones, Crown } from "lucide-react";

export const pricingPlans = [
  {
    id: "free",
    title: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      { icon: Mail, text: "10 emails per month" },
      { icon: Users, text: "2 email variants per generation" },
      { icon: TrendingUp, text: "4 tone options (Friendly, Professional, Direct, Casual)" },
      { icon: Star, text: "Industry templates" },
      { icon: Headphones, text: "Basic support" },
    ],
    buttonVariant: "outline" as const,
  },
  {
    id: "starter",
    title: "Starter",
    price: "$12",
    description: "per month • Perfect for freelancers and growing teams",
    features: [
      { icon: Mail, text: "50 emails per month" },
      { icon: Users, text: "3 email variants per generation" },
      { icon: TrendingUp, text: "All tone options" },
      { icon: Star, text: "Industry templates" },
      { icon: Headphones, text: "Priority support" },
    ],
    buttonVariant: "primary" as const,
  },
  {
    id: "pro",
    title: "Pro",
    price: "$29",
    description: "per month • Built for teams sending high-volume outreach",
    features: [
      { icon: Mail, text: "Unlimited emails" },
      { icon: Users, text: "5 email variants per generation" },
      { icon: TrendingUp, text: "All tone options" },
      { icon: Star, text: "Industry templates" },
      { icon: Headphones, text: "Priority support" },
      { icon: Crown, text: "Advanced AI features" },
    ],
    highlight: true,
    mostPopular: true,
  },
];
