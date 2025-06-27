
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

interface UsageData {
  current: number;
  limit: number;
  tier: string;
  percentage: number;
  canGenerate: boolean;
}

export const useUsage = () => {
  const [usage, setUsage] = useState<UsageData>({
    current: 0,
    limit: 10,
    tier: 'free',
    percentage: 0,
    canGenerate: true
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { subscribed, subscription_tier } = useSubscription();

  const getUsageLimits = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'starter':
        return 50;
      case 'pro':
        return -1; // unlimited
      default:
        return 10; // free tier - strictly enforce 10 limit
    }
  };

  const getCurrentUsage = async () => {
    if (!user) {
      setUsage({
        current: 0,
        limit: 10,
        tier: 'free',
        percentage: 0,
        canGenerate: false // Not logged in users cannot generate
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_user_monthly_usage', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching usage:', error);
        return;
      }

      const currentUsage = data || 0;
      const userTier = subscribed ? (subscription_tier?.toLowerCase() || 'starter') : 'free';
      const limit = getUsageLimits(userTier);
      const percentage = limit === -1 ? 0 : (currentUsage / limit) * 100;
      
      // Strict enforcement: free users cannot generate if they've reached 10
      const canGenerate = limit === -1 || currentUsage < limit;

      console.log('Usage check:', { currentUsage, limit, userTier, canGenerate });

      setUsage({
        current: currentUsage,
        limit,
        tier: userTier,
        percentage,
        canGenerate
      });
    } catch (err) {
      console.error('Error in getCurrentUsage:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsage = async () => {
    setLoading(true);
    await getCurrentUsage();
  };

  useEffect(() => {
    getCurrentUsage();
  }, [user, subscribed, subscription_tier]);

  return {
    usage,
    loading,
    refreshUsage
  };
};
