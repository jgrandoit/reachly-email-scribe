
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { EmailGenerator } from "@/components/EmailGenerator";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);
  const { toast } = useToast();
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    // Check for success/canceled query params from Stripe
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated. It may take a few minutes to update.",
      });
      // Refresh subscription status
      setTimeout(() => {
        checkSubscription();
      }, 2000);
      // Clear the URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your subscription was not activated.",
        variant: "destructive",
      });
      // Clear the URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, checkSubscription]);

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
