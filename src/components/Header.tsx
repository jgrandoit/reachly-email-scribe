
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface HeaderProps {
  onGetStarted: () => void;
  onBackToHome: () => void;
  currentView: "home" | "dashboard" | "generator";
}

export const Header = ({ onGetStarted, onBackToHome, currentView }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={onBackToHome}
          >
            <Mail className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Reachly AI
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {user && (
            <>
              <Link to="/examples" className="text-gray-600 hover:text-gray-900 transition-colors">
                Examples
              </Link>
              <Link 
                to="/admin-test-setup" 
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span>Test Setup</span>
              </Link>
            </>
          )}
          {!user ? (
            <div className="flex items-center space-x-4">
              <Link to="/auth" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Button onClick={onGetStarted}>Get Started</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
              {currentView === "home" && (
                <Button onClick={onGetStarted}>Dashboard</Button>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {user && (
              <>
                <Link 
                  to="/examples" 
                  className="block text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Examples
                </Link>
                <Link 
                  to="/admin-test-setup" 
                  className="block text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Test Setup
                </Link>
              </>
            )}
            {!user ? (
              <div className="space-y-4">
                <Link 
                  to="/auth" 
                  className="block text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Button onClick={onGetStarted} className="w-full">Get Started</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  {user.email}
                </div>
                <Button variant="outline" onClick={handleSignOut} className="w-full">
                  Sign Out
                </Button>
                {currentView === "home" && (
                  <Button onClick={onGetStarted} className="w-full">Dashboard</Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
