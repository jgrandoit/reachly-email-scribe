
import { useState, useEffect, createContext, useContext } from "react";

interface TestModeContextType {
  isTestMode: boolean;
  testTier: 'free' | 'starter' | 'pro' | null;
  setTestTier: (tier: 'free' | 'starter' | 'pro' | null) => void;
  clearTestMode: () => void;
}

const TestModeContext = createContext<TestModeContextType | undefined>(undefined);

export const TestModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [testTier, setTestTier] = useState<'free' | 'starter' | 'pro' | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Check for test mode in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const testParam = urlParams.get('test');
    const tierParam = urlParams.get('tier') as 'free' | 'starter' | 'pro' | null;

    if (testParam === 'true' && tierParam && ['free', 'starter', 'pro'].includes(tierParam)) {
      setIsTestMode(true);
      setTestTier(tierParam);
      console.log(`[TEST MODE] Activated with tier: ${tierParam}`);
    } else {
      // Check localStorage for persistent test mode
      const savedTestMode = localStorage.getItem('test_mode');
      const savedTestTier = localStorage.getItem('test_tier') as 'free' | 'starter' | 'pro' | null;
      
      if (savedTestMode === 'true' && savedTestTier) {
        setIsTestMode(true);
        setTestTier(savedTestTier);
        console.log(`[TEST MODE] Restored from storage with tier: ${savedTestTier}`);
      }
    }
  }, []);

  const handleSetTestTier = (tier: 'free' | 'starter' | 'pro' | null) => {
    if (tier) {
      setIsTestMode(true);
      setTestTier(tier);
      localStorage.setItem('test_mode', 'true');
      localStorage.setItem('test_tier', tier);
      console.log(`[TEST MODE] Set to tier: ${tier}`);
    } else {
      clearTestMode();
    }
  };

  const clearTestMode = () => {
    setIsTestMode(false);
    setTestTier(null);
    localStorage.removeItem('test_mode');
    localStorage.removeItem('test_tier');
    console.log('[TEST MODE] Cleared');
  };

  return (
    <TestModeContext.Provider value={{
      isTestMode,
      testTier,
      setTestTier: handleSetTestTier,
      clearTestMode
    }}>
      {children}
    </TestModeContext.Provider>
  );
};

export const useTestMode = () => {
  const context = useContext(TestModeContext);
  if (context === undefined) {
    throw new Error("useTestMode must be used within a TestModeProvider");
  }
  return context;
};
