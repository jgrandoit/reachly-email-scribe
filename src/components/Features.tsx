
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Clock, Target, TrendingUp, Users, Zap } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Writing",
      description: "Crafts compelling, personalized emails proven to get responses"
    },
    {
      icon: Clock,
      title: "30-Second Generation",
      description: "From idea to inbox-ready in under 30 seconds"
    },
    {
      icon: Target,
      title: "Audience Targeting",
      description: "Tailored messaging for your specific audience and industry"
    },
    {
      icon: TrendingUp,
      title: "High Conversion",
      description: "Tested frameworks that consistently deliver replies and results"
    },
    {
      icon: Users,
      title: "Multiple Variants",
      description: "Get 2 different email styles to test what works best"
    },
    {
      icon: Zap,
      title: "Instant Copy",
      description: "Copy and send in one click — no edits required"
    }
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          Everything You Need to Close More Deals
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Powerful features designed to make cold outreach effortless and effective
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
