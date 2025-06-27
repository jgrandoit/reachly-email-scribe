import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { EmailGenerator } from "@/components/EmailGenerator";
import { Dashboard } from "@/components/Dashboard";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "dashboard" | "generator">("home");
  const { toast } = useToast();
  const { checkSubscription } = useSubscription();
  const { user } = useAuth();

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

  // Show dashboard for logged-in users by default
  useEffect(() => {
    if (user && currentView === "home") {
      setCurrentView("dashboard");
    } else if (!user && currentView !== "home") {
      setCurrentView("home");
    }
  }, [user, currentView]);

  const handleGetStarted = () => {
    console.log("Get Started clicked, user:", !!user);
    if (user) {
      setCurrentView("generator");
    } else {
      // Redirect to auth page for non-logged in users
      window.location.href = "/auth";
    }
  };

  console.log("Current view:", currentView, "User logged in:", !!user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header 
        onGetStarted={handleGetStarted}
        onBackToHome={() => setCurrentView("home")}
        currentView={currentView}
      />
      
      {currentView === "home" && (
        <div className="pb-20">
          <Hero onGetStarted={handleGetStarted} />
          <div className="pt-10 pb-14">
            <Features />
          </div>
          <div className="pt-10 pb-14">
            <Pricing onGetStarted={handleGetStarted} />
          </div>
        </div>
      )}

      {currentView === "dashboard" && user && (
        <Dashboard onStartGenerator={() => setCurrentView("generator")} />
      )}

      {currentView === "generator" && <EmailGenerator />}
    </div>
  );
};

export default Index;
