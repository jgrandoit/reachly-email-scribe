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
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { trackAuth } from "@/utils/analytics";
import { Footer } from "@/components/Footer";

const ADMIN_EMAIL = "blessup127@gmail.com";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "dashboard" | "generator" | "analytics">("home");
  const { toast } = useToast();
  const { checkSubscription } = useSubscription();
  const { user, loading } = useAuth();

  const isAdmin = user?.email === ADMIN_EMAIL;

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
      trackAuth('login', user.id);
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

  const handleViewAnalytics = () => {
    if (isAdmin) {
      setCurrentView("analytics");
    } else {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view analytics.",
        variant: "destructive",
      });
    }
  };

  console.log("Current view:", currentView, "User logged in:", !!user);

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, don't show homepage content during redirect
  if (user && currentView === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header 
        onGetStarted={handleGetStarted}
        onBackToHome={() => setCurrentView("home")}
        currentView={currentView}
      />
      
      {currentView === "home" && (
        <div>
          <Hero onGetStarted={handleGetStarted} />
          <div className="pt-10 pb-14">
            <Features />
          </div>
          <div className="pt-10 pb-14">
            <Pricing onGetStarted={handleGetStarted} />
          </div>
          <Footer />
        </div>
      )}

      {currentView === "dashboard" && user && (
        <Dashboard 
          onStartGenerator={() => setCurrentView("generator")}
          onViewAnalytics={handleViewAnalytics}
        />
      )}

      {currentView === "generator" && <EmailGenerator />}

      {currentView === "analytics" && user && isAdmin && (
        <div className="container mx-auto px-4 py-8">
          <AnalyticsDashboard />
        </div>
      )}
    </div>
  );
};

export default Index;
