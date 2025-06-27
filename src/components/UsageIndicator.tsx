
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Crown, Zap } from "lucide-react";

interface UsageData {
  current: number;
  limit: number;
  tier: string;
  percentage: number;
  canGenerate: boolean;
}

interface UsageIndicatorProps {
  usage: UsageData;
  onUpgrade: () => void;
}

export const UsageIndicator = ({ usage, onUpgrade }: UsageIndicatorProps) => {
  const getProgressColor = () => {
    if (usage.limit === -1) return "bg-green-500"; // Unlimited
    if (usage.percentage > 80) return "bg-red-500";
    if (usage.percentage > 60) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getTierIcon = () => {
    switch (usage.tier) {
      case 'pro':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'starter':
        return <Zap className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getTierIcon()}
            <span className="text-sm font-medium text-gray-700">
              Monthly Usage ({usage.tier})
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {usage.current} / {usage.limit === -1 ? '∞' : usage.limit}
          </span>
        </div>
        
        {usage.limit !== -1 ? (
          <div className="space-y-2">
            <Progress 
              value={usage.percentage} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span className={`font-medium ${usage.percentage > 80 ? 'text-red-600' : 'text-gray-600'}`}>
                {Math.round(usage.percentage)}% used
              </span>
              <span>{usage.limit}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 text-green-600 font-medium">
              <Crown className="w-4 h-4" />
              <span>Unlimited emails</span>
            </div>
          </div>
        )}

        {usage.percentage > 80 && usage.limit !== -1 && (
          <Alert className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              You're running low on emails. 
              <Button 
                variant="link" 
                className="p-0 ml-1 h-auto text-blue-600 text-sm"
                onClick={onUpgrade}
              >
                Upgrade now
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
