
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTestMode } from "@/hooks/useTestMode";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

interface SubscriptionContextType extends SubscriptionData {
  loading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: (plan: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const { isTestMode, testTier } = useTestMode();
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });

  const checkSubscription = async () => {
    // If in test mode, override with test data
    if (isTestMode && testTier) {
      console.log(`[TEST MODE] Overriding subscription with tier: ${testTier}`);
      const testSubscriptionData = {
        subscribed: testTier !== 'free',
        subscription_tier: testTier === 'free' ? null : testTier,
        subscription_end: testTier === 'free' ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      setSubscriptionData(testSubscriptionData);
      return;
    }

    if (!user || !session) {
      console.log('No user or session, skipping subscription check');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Checking subscription for user:', user.email);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error from check-subscription function:', error);
        throw error;
      }
      
      console.log('Subscription data received:', data);
      const newSubscriptionData = {
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
      };
      
      console.log('Setting subscription data:', newSubscriptionData);
      setSubscriptionData(newSubscriptionData);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (plan: string) => {
    if (isTestMode) {
      toast({
        title: "Test Mode Active",
        description: `Cannot create checkout in test mode. Currently simulating ${testTier} tier.`,
        variant: "destructive",
      });
      return;
    }

    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (isTestMode) {
      toast({
        title: "Test Mode Active",
        description: `Cannot open customer portal in test mode. Currently simulating ${testTier} tier.`,
        variant: "destructive",
      });
      return;
    }

    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage subscription",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check subscription when user, session, or test mode changes
  useEffect(() => {
    if (isTestMode) {
      // Immediately update with test data
      checkSubscription();
    } else if (user && session) {
      console.log('User and session available, checking subscription');
      checkSubscription();
    } else {
      console.log('No user or session, resetting subscription data');
      setSubscriptionData({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
      });
    }
  }, [user, session, isTestMode, testTier]);

  // Additional effect to log subscription data changes
  useEffect(() => {
    console.log('Subscription data updated:', subscriptionData);
  }, [subscriptionData]);

  const value = {
    ...subscriptionData,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
