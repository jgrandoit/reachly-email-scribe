
import { Button } from "@/components/ui/button";
import { Mail, User, LogOut, Home, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onGetStarted: () => void;
  onBackToHome?: () => void;
  currentView?: string;
}

export const Header = ({ onGetStarted, onBackToHome, currentView }: HeaderProps) => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-white/20 backdrop-blur-sm bg-white/70 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          onClick={onBackToHome}
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Reachly
          </span>
        </button>
        
        <nav className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              {currentView !== "dashboard" && (
                <Button
                  variant="ghost"
                  onClick={onBackToHome}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    <User className="w-4 h-4 mr-2" />
                    Welcome, {user.email?.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onBackToHome?.()}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900" asChild>
                <a href="/auth">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </a>
              </Button>
            </>
          )}
          
          <Button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            {user ? "Generate Email" : "Get Started"}
          </Button>
        </nav>
      </div>
    </header>
  );
};
