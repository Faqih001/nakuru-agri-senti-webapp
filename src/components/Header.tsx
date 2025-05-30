import { Button } from "@/components/ui/button";
import { Sprout, Bell, User, HelpCircle, BookOpen, PhoneCall, Settings, LogOut } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="bg-green-600 p-2 lg:p-2.5 rounded-lg">
            <Sprout className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-green-800 text-base lg:text-lg">AgriSenti</h2>
            <p className="text-xs lg:text-sm text-green-600 hidden sm:block">Dashboard</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Help & Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-green-700 p-2 lg:px-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Help & Resources</span>
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
          
          <Button variant="ghost" size="sm" className="text-green-700 p-2 relative">
            <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Button variant="ghost" size="sm" className="text-green-700 p-2">
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
                <div className="text-sm lg:text-base text-green-700">
                  <div className="font-medium">Welcome, Farmer</div>
                  <div className="text-xs lg:text-sm hidden sm:block">Nakuru County</div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/dashboard/profile">
                  <User className="w-4 h-4 mr-2" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/dashboard/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600">
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
