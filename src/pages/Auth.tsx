
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

// Comprehensive auth state cleanup utility
const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('User already authenticated, redirecting...');
          navigate("/");
        }
      } catch (error) {
        console.error('Error checking session:', error);
        cleanupAuthState();
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('Starting authentication process...');

    try {
      if (isLogin) {
        // Clean up existing state before login
        cleanupAuthState();
        
        // Force sign out any existing sessions
        try {
          await supabase.auth.signOut({ scope: 'global' });
          console.log('Global signout completed');
        } catch (err) {
          console.log('Global signout error (expected):', err);
        }

        // Wait a moment for cleanup to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('Attempting to sign in with:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        console.log('Sign in response:', { data: !!data.user, error });

        if (error) {
          console.error('Auth error details:', error);
          
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please check your credentials and try again.",
              variant: "destructive",
            });
          } else if (error.message.includes('Email not confirmed')) {
            toast({
              title: "Email Not Confirmed",
              description: "Please check your email and confirm your account before signing in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: error.message || "An error occurred during authentication.",
              variant: "destructive",
            });
          }
          return;
        }

        if (data.user) {
          console.log('Sign in successful for:', data.user.email);
          toast({
            title: "Success",
            description: "Welcome back!",
          });
          
          // Force page reload for clean state
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        }
      } else {
        // Sign up flow
        if (!fullName) {
          toast({
            title: "Error",
            description: "Please enter your full name.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Clean up existing state before signup
        cleanupAuthState();

        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          console.error('Signup error:', error);
          
          if (error.message.includes('User already registered')) {
            toast({
              title: "Account Exists",
              description: "An account with this email already exists. Please sign in instead.",
              variant: "destructive",
            });
            setIsLogin(true);
          } else {
            toast({
              title: "Error",
              description: error.message || "An error occurred during registration.",
              variant: "destructive",
            });
          }
          return;
        }

        if (data.user) {
          toast({
            title: "Success",
            description: "Account created successfully! Please check your email for verification.",
          });
        }
      }
    } catch (error: any) {
      console.error("Unexpected auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="mb-8 mt-6 text-center">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-base">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Reachly
            </span>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 border border-white/20 w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to your account to continue" 
                : "Sign up to start generating perfect cold emails"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-12 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all duration-200"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all duration-200"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setFullName("");
                }}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isLogin 
                  ? <>Don't have an account? <span className="font-medium hover:underline">Sign up</span></> 
                  : <>Already have an account? <span className="font-medium hover:underline">Sign in</span></>
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
