
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Mail, Sparkles, Users, Zap, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmailGenerator } from "@/components/EmailGenerator";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header onGetStarted={() => setShowGenerator(true)} />
      
      {!showGenerator ? (
        <div className="space-y-20 pb-20">
          <Hero onGetStarted={() => setShowGenerator(true)} />
          <Features />
          <Pricing onGetStarted={() => setShowGenerator(true)} />
        </div>
      ) : (
        <EmailGenerator />
      )}
    </div>
  );
};

export default Index;
