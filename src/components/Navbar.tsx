
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sprout, Menu, X, User, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg shadow-md">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-green-800 text-base sm:text-lg truncate">AgriSenti</h2>
              <p className="text-xs text-green-600 hidden sm:block truncate">Smart Farming Solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-green-600 px-2 py-1 rounded-md ${
                  isActive(item.href) 
                    ? "text-green-600 bg-green-50" 
                    : "text-gray-700 hover:bg-green-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 shadow-md">
                <User className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-green-50"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-green-200 shadow-lg rounded-b-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2.5 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "text-green-600 bg-green-50 border-l-4 border-green-600"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-green-200 mt-4">
                <div className="space-y-2 px-3">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-green-700 hover:bg-green-50">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 shadow-md">
                      <User className="w-4 h-4 mr-2" />
                      Sign Up Free
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
