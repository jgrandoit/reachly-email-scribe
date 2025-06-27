
import { Button } from "@/components/ui/button";
import { Mail, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { analytics, trackPageView, trackAuth } from "@/utils/analytics";
import { useEffect } from "react";

interface HeaderProps {
  onGetStarted: () => void;
  onBackToHome: () => void;
  currentView: "home" | "dashboard" | "generator";
}

export const Header = ({ onGetStarted, onBackToHome, currentView }: HeaderProps) => {
  const { user, signOut } = useAuth();

  useEffect(() => {
    trackPageView(currentView, user?.id);
  }, [currentView, user?.id]);

  const handleSignOut = () => {
    trackAuth('logout', user?.id);
    signOut();
  };

  const handleGetStarted = () => {
    analytics.track('get_started_clicked', { from: 'header', authenticated: !!user }, user?.id);
    onGetStarted();
  };

  const handleBackToHome = () => {
    analytics.track('back_to_home_clicked', { from: currentView }, user?.id);
    onBackToHome();
  };

  return (
    <header className="w-full border-b border-white/20 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={handleBackToHome}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Reachly
          </span>
        </button>

        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                to="/examples" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => analytics.track('examples_link_clicked', {}, user.id)}
              >
                Examples
              </Link>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/examples" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => analytics.track('examples_link_clicked')}
              >
                Examples
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => analytics.track('signin_link_clicked')}
                  >
                    Sign In
                  </Button>
                </Link>
                <Button onClick={handleGetStarted} size="sm">
                  Get Started
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
