
import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";

interface HeaderProps {
  onGetStarted: () => void;
}

export const Header = ({ onGetStarted }: HeaderProps) => {
  return (
    <header className="border-b border-white/20 backdrop-blur-sm bg-white/70 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Reachly
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </a>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            <User className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          <Button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
};
