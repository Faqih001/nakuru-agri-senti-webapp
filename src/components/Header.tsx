
import { Button } from "@/components/ui/button";
import { Sprout, Bell, User, HelpCircle, BookOpen, PhoneCall } from "lucide-react";
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
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg">
            <Sprout className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-green-800 text-sm sm:text-base">AgriSenti</h2>
            <p className="text-xs text-green-600 hidden sm:block">Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Help & Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-green-700 p-1 sm:p-2 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
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
          
          <Button variant="ghost" size="sm" className="text-green-700 p-1 sm:p-2">
            <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-green-700 p-1 sm:p-2">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <div className="text-xs sm:text-sm text-green-700">
            <div className="font-medium">Welcome, Farmer</div>
            <div className="text-xs hidden sm:block">Nakuru County</div>
          </div>
        </div>
      </div>
    </header>
  );
};
