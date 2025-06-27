
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube, X, Settings } from "lucide-react";
import { useTestMode } from "@/hooks/useTestMode";
import { useAuth } from "@/hooks/useAuth";

export const TestModePanel = () => {
  const { isTestMode, testTier, setTestTier, clearTestMode } = useTestMode();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development or when test mode is active
  const shouldShow = process.env.NODE_ENV === 'development' || isTestMode;

  if (!shouldShow) return null;

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          variant={isTestMode ? "default" : "secondary"}
          size="sm"
          className={`shadow-lg ${isTestMode ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
        >
          <TestTube className="w-4 h-4 mr-2" />
          Test Mode
          {isTestMode && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {testTier?.toUpperCase()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Control panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 w-80">
          <Card className="shadow-xl border-2 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TestTube className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg text-orange-800">Test Mode</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription className="text-orange-700">
                Override subscription tier for testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-orange-800">
                  Select Test Tier:
                </label>
                <Select
                  value={testTier || "none"}
                  onValueChange={(value) => {
                    if (value === "none") {
                      clearTestMode();
                    } else {
                      setTestTier(value as 'free' | 'starter' | 'pro');
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose tier..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Test Mode</SelectItem>
                    <SelectItem value="free">Free Tier</SelectItem>
                    <SelectItem value="starter">Starter Tier</SelectItem>
                    <SelectItem value="pro">Pro Tier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isTestMode && (
                <div className="p-3 bg-orange-100 rounded-lg border border-orange-300">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Current Override:
                    </span>
                  </div>
                  <div className="text-sm text-orange-700">
                    <p>Tier: <strong>{testTier?.toUpperCase()}</strong></p>
                    <p>User: {user ? user.email : 'Not logged in'}</p>
                  </div>
                </div>
              )}

              <div className="text-xs text-orange-600 space-y-1">
                <p><strong>Quick URLs:</strong></p>
                <div className="space-y-1 font-mono text-xs">
                  <p>?test=true&tier=free</p>
                  <p>?test=true&tier=starter</p>
                  <p>?test=true&tier=pro</p>
                </div>
              </div>

              {isTestMode && (
                <Button
                  onClick={clearTestMode}
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Clear Test Mode
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
