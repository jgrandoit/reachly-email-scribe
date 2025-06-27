
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const testAccounts = [
  {
    email: "free-user@example.com",
    password: "testpassword123",
    fullName: "Free User",
    tier: "free",
    description: "Free plan user (10 emails/month)"
  },
  {
    email: "starter-user@example.com", 
    password: "testpassword123",
    fullName: "Starter User",
    tier: "starter",
    description: "Starter plan user (50 emails/month)"
  },
  {
    email: "pro-user@example.com",
    password: "testpassword123", 
    fullName: "Pro User",
    tier: "pro",
    description: "Pro plan user (unlimited emails)"
  }
];

export const AdminTestSetup = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'create' | 'configure'>('create');
  const { toast } = useToast();
  const { user } = useAuth();

  const createTestAccount = async (account: typeof testAccounts[0]) => {
    try {
      console.log(`Creating account for ${account.email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: account.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`Account ${account.email} already exists`);
          return { success: true, message: 'Account already exists' };
        }
        throw error;
      }

      console.log(`Successfully created account for ${account.email}`);
      return { success: true, message: 'Account created successfully' };
    } catch (error: any) {
      console.error(`Error creating account for ${account.email}:`, error);
      return { success: false, error: error.message };
    }
  };

  const configureTestData = async (email: string, tier: string) => {
    try {
      console.log(`Configuring test data for ${email} with tier ${tier}`);
      
      const { data, error } = await supabase.rpc('setup_test_user', {
        p_email: email,
        p_tier: tier
      });

      if (error) throw error;

      console.log(`Successfully configured test data for ${email}`);
      return { success: true };
    } catch (error: any) {
      console.error(`Error configuring test data for ${email}:`, error);
      return { success: false, error: error.message };
    }
  };

  const handleCreateAllAccounts = async () => {
    setLoading(true);
    let successCount = 0;
    let errors: string[] = [];

    for (const account of testAccounts) {
      const result = await createTestAccount(account);
      if (result.success) {
        successCount++;
      } else {
        errors.push(`${account.email}: ${result.error}`);
      }
      
      // Small delay between account creations
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setLoading(false);
    
    if (successCount === testAccounts.length) {
      toast({
        title: "Success!",
        description: `All ${successCount} test accounts created successfully. Now configure their subscription data.`,
      });
      setCurrentStep('configure');
    } else {
      toast({
        title: "Partial Success",
        description: `${successCount}/${testAccounts.length} accounts created. ${errors.length > 0 ? 'Errors: ' + errors.join(', ') : ''}`,
        variant: errors.length > 0 ? "destructive" : "default",
      });
      if (successCount > 0) {
        setCurrentStep('configure');
      }
    }
  };

  const handleConfigureAllData = async () => {
    setLoading(true);
    let successCount = 0;
    let errors: string[] = [];

    for (const account of testAccounts) {
      const result = await configureTestData(account.email, account.tier);
      if (result.success) {
        successCount++;
      } else {
        errors.push(`${account.email}: ${result.error}`);
      }
      
      // Small delay between configurations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setLoading(false);
    
    if (successCount === testAccounts.length) {
      toast({
        title: "Configuration Complete!",
        description: `All ${successCount} test accounts configured successfully. You can now test different subscription tiers.`,
      });
    } else {
      toast({
        title: "Configuration Issues",
        description: `${successCount}/${testAccounts.length} accounts configured. ${errors.length > 0 ? 'Errors: ' + errors.join(', ') : ''}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Account Setup Utility</CardTitle>
          <CardDescription>
            Create and configure test accounts for different subscription tiers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Accounts to Create:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testAccounts.map((account, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{account.fullName}</CardTitle>
                    <CardDescription className="text-sm">
                      {account.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1 text-sm">
                      <div><strong>Email:</strong> {account.email}</div>
                      <div><strong>Password:</strong> {account.password}</div>
                      <div><strong>Tier:</strong> {account.tier}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Step 1: Create Accounts */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                currentStep === 'create' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                {currentStep === 'create' ? '1' : '✓'}
              </div>
              <h3 className="text-lg font-semibold">Step 1: Create Test Accounts</h3>
            </div>
            
            <p className="text-gray-600">
              This will create user accounts through the authentication system. Each account will be created with the credentials shown above.
            </p>
            
            <Button 
              onClick={handleCreateAllAccounts}
              disabled={loading || currentStep === 'configure'}
              className="w-full"
            >
              {loading ? "Creating Accounts..." : currentStep === 'configure' ? "Accounts Created ✓" : "Create All Test Accounts"}
            </Button>
          </div>

          {/* Step 2: Configure Data */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                currentStep === 'configure' ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                2
              </div>
              <h3 className="text-lg font-semibold">Step 2: Configure Subscription Data</h3>
            </div>
            
            <p className="text-gray-600">
              This will set up the subscription tiers and usage data for each test account using the database helper function.
            </p>
            
            <Button 
              onClick={handleConfigureAllData}
              disabled={loading || currentStep !== 'configure'}
              className="w-full"
              variant={currentStep === 'configure' ? 'default' : 'outline'}
            >
              {loading ? "Configuring Data..." : "Configure All Subscription Data"}
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">After Setup:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Sign out of your current account</li>
              <li>• Sign in with any of the test accounts above</li>
              <li>• Test the different features available in each tier</li>
              <li>• Free tier: 10 emails/month limit</li>
              <li>• Starter tier: 50 emails/month limit</li>
              <li>• Pro tier: Unlimited emails</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
