
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
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="border-2 border-gray-200 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Free</CardTitle>
            <div className="text-4xl font-bold text-gray-900 mt-4">$0</div>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>10 emails per month</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>2 email variants per generation</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>3 tone options</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>Basic support</span>
              </div>
            </div>
            <Button onClick={onGetStarted} variant="outline" className="w-full mt-6">
              Get Started Free
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Most Popular</span>
            </div>
          </div>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Pro</CardTitle>
            <div className="text-4xl font-bold text-gray-900 mt-4">$29</div>
            <CardDescription>per month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-medium">Unlimited emails</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>2 email variants per generation</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>All tone options</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span>Advanced AI features</span>
              </div>
            </div>
            <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
