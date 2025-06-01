import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  Sprout,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Home,
  Scan,
  Cloud,
  TrendingUp,
  Settings,
  LogOut,
  HelpCircle,
  Mail,
  Layout as LayoutIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

// Sidebar Navigation Items
const sidebarItems = [
  { label: "Overview", icon: Home, path: "/dashboard" },
  { label: "Crop Assistant", icon: Sprout, path: "/dashboard/crop-assistant" },
  { label: "Disease Detection", icon: Scan, path: "/dashboard/disease-detection" },
  { label: "Weather", icon: Cloud, path: "/dashboard/weather" },
  { label: "Market Prices", icon: TrendingUp, path: "/dashboard/market" },
  { label: "Help & Resources", icon: HelpCircle, path: "/dashboard/help" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export const DashboardLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Update sidebar state when screen size changes or during navigation
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  // Close sidebar on navigation when on mobile
  const location = useLocation();
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/landing");
  };

  const userInitials = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header - Full width */}
      <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="flex items-center justify-center"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2.5 rounded-lg shadow-md">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-800 tracking-tight">AgriSenti</h1>
                <p className="text-xs text-green-600 hidden sm:block">Smart Farming Platform</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center space-x-4 w-96 ml-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 bg-gray-50 border-gray-200 w-full focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium flex items-center justify-center text-white">3</span>
            </Button>

            {/* User Avatar */}
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Now starts below the header */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white border-r border-gray-200",
          "transition-all duration-300 ease-in-out flex flex-col",
          isMobile 
            ? (isSidebarOpen ? "translate-x-0 shadow-xl w-72" : "-translate-x-full")
            : "w-64 translate-x-0"
        )}
      >
        {/* Mobile close button - only on mobile */}
        {isMobile && (
          <div className="h-12 flex items-center px-4 border-b border-gray-100 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-green-100">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-green-600 text-white">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{user?.email?.split('@')[0]}</div>
              <div className="text-xs text-gray-500 truncate max-w-[180px]">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={isMobile ? () => setIsSidebarOpen(false) : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors",
                  isActive
                    ? "text-green-700 bg-green-50/80 font-semibold"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50/60"
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3">{item.label}</span>
              {item.path === "/dashboard/help" && (
                <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-200">New</Badge>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <Button
            variant="ghost"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50/60 justify-start font-medium"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="ml-3">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 pt-16", // Added pt-16 to account for the fixed header
        isMobile ? "" : "ml-64"
      )}>

        {/* Page Content */}
        <main className="min-h-screen">
          <div className="p-6">
            <Outlet />
          </div>
        </main>

        {/* Mobile floating action button */}
        {isMobile && !isSidebarOpen && (
          <Button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-6 right-6 z-20 h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
            size="icon"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
