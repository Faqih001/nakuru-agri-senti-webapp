import { Button } from "@/components/ui/button";
import { Sprout, Bell, User, HelpCircle, BookOpen, PhoneCall, Settings, LogOut, Menu } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-green-700 hover:text-green-800 hover:bg-green-50 p-2 flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity min-w-0">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 sm:p-2 lg:p-2.5 rounded-lg shadow-md flex-shrink-0">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-green-800 text-sm sm:text-base lg:text-lg tracking-tight truncate">AgriSenti</h2>
              <p className="text-xs lg:text-sm text-green-600 hidden sm:block truncate">Smart Farming Platform</p>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
          {/* Help & Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-700 hover:text-green-800 hover:bg-green-50 p-2 lg:px-3 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden md:inline text-sm lg:text-base">Help & Resources</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Get help with AgriSenti dashboard and features</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/dashboard/help?tab=tutorials">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>View Tutorials</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/dashboard/help?tab=support">
                  <PhoneCall className="w-4 h-4 mr-2" />
                  <span>Contact Support</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-700 hover:text-green-800 hover:bg-green-50 p-2 relative"
          >
            <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer group">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-700 hover:text-green-800 hover:bg-green-50 p-2"
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
                <div className="text-sm lg:text-base text-green-700 group-hover:text-green-800 hidden sm:block min-w-0">
                  <div className="font-medium text-xs sm:text-sm lg:text-base truncate">Welcome, Farmer</div>
                  <div className="text-xs lg:text-sm text-green-600 hidden md:block truncate">Nakuru County</div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
