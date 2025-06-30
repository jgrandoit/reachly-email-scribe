
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ReachFlo
              </span>
            </div>
            <p className="text-gray-600 max-w-md">
              Generate powerful cold emails that convert. AI-powered email generation for sales professionals and marketers.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/examples" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Examples
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2025 ReachFlo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
