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
  User,
  BookOpen,
  PhoneCall,
  Zap,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Header - Full width with responsive design */}
      <header className="h-14 sm:h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200/80 fixed top-0 left-0 right-0 z-40 lg:ml-64 shadow-sm">
        <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* AgriSenti Logo and Subtitle - now in header */}
            <div className="flex items-center gap-3 mr-2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 sm:p-2.5 rounded-xl shadow-lg ring-2 ring-green-100">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-green-800 text-lg sm:text-xl tracking-tight">AgriSenti</h1>
                <p className="text-xs text-green-600 font-medium">Smart Farming Platform</p>
              </div>
            </div>

            {/* Mobile menu button - only on mobile */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="flex items-center justify-center p-2 hover:bg-green-50 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </Button>
            )}

            {/* Weather Widget - Enhanced */}
            <div className="flex items-center gap-2 bg-blue-50/80 px-2 sm:px-3 py-1.5 rounded-lg border border-blue-100">
              <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span className="text-sm sm:text-base font-medium text-blue-700">24°C</span>
              <span className="text-xs text-blue-600 hidden sm:inline">Nakuru</span>
            </div>

            {/* Search Bar - Improved responsiveness */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                <Input
                  placeholder="Search crops, weather, markets..."
                  className="pl-10 bg-gray-50/80 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all h-9"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 hover:bg-gray-50"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Quick Actions - Enhanced */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-700 hover:text-green-800 hover:bg-green-50 p-2 transition-colors"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden lg:inline ml-2">Quick Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Scan className="w-4 h-4 mr-2" />
                  <span>Scan Crop Disease</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Cloud className="w-4 h-4 mr-2" />
                  <span>Check Weather</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>View Market Prices</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Notifications - Enhanced */}
            <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-500 text-[9px] sm:text-[10px] font-medium flex items-center justify-center text-white animate-pulse">
                2
              </span>
            </Button>

            {/* User Avatar - Enhanced */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-green-100 ring-2 ring-green-50">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-sm">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-green-700 hidden sm:block">
                    <div className="font-medium leading-tight">Welcome!</div>
                    <div className="text-xs text-green-600 leading-tight">{user?.email?.split('@')[0]}</div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-green-600 text-white text-xs">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user?.email?.split('@')[0]}</div>
                    <div className="text-xs text-gray-500">Farmer Account</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span>Help Center</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ease-in-out backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Enhanced design */}
      <aside
        className={cn(
          // Adjust top and height to sit below header
          "fixed left-0 z-50 bg-white/95 backdrop-blur-sm border-r border-gray-200/80 shadow-xl",
          "transition-all duration-300 ease-in-out flex flex-col",
          isMobile
            ? [
                isSidebarOpen ? "translate-x-0 w-72 sm:w-80" : "-translate-x-full",
                "top-14 sm:top-16",
                "h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]"
              ].join(' ')
            : [
                "w-64 translate-x-0",
                "top-14 sm:top-16",
                "h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]"
              ].join(' ')
        )}
        style={{ marginTop: 0, paddingTop: 0 }}
      >
        {/* Mobile close button and empty logo section for spacing */}
        <div className="h-14 sm:h-16 flex items-center px-4 sm:px-6 border-b border-gray-200/80 bg-gradient-to-r from-green-50 to-emerald-50">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* User Profile Section - Enhanced */}
        <div className="p-4 sm:p-6 border-b border-gray-100/80 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-green-200 ring-4 ring-green-50">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">{user?.email?.split('@')[0]}</div>
              <div className="text-xs text-green-600 font-medium">Nakuru Farmer</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section - Enhanced */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
          <h3 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">DASHBOARD</h3>
        </div>
        
        {/* Navigation Items - Enhanced */}
        <nav className="flex-1 overflow-y-auto px-2 sm:px-3 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={isMobile ? () => setIsSidebarOpen(false) : undefined}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  isActive
                    ? "text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm border border-green-100 font-semibold"
                    : "text-gray-600 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50"
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              <span className="ml-3 truncate">{item.label}</span>
              {item.path === "/dashboard/disease-detection" && (
                <Badge className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs">AI</Badge>
              )}
              {item.path === "/dashboard/crop-assistant" && (
                <Badge className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">Chat</Badge>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Settings & Help Section - Enhanced */}
        <div className="px-4 sm:px-6 pt-4 pb-2">
          <h3 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">ACCOUNT</h3>
        </div>
        
        {/* Settings Navigation - Enhanced */}
        <nav className="px-2 sm:px-3 space-y-1">
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 sm:px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                isActive
                  ? "text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm border border-green-100 font-semibold"
                  : "text-gray-600 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50"
              )
            }
          >
            <User className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
            <span className="ml-3">My Profile</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 sm:px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                isActive
                  ? "text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm border border-green-100 font-semibold"
                  : "text-gray-600 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50"
              )
            }
          >
            <Settings className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
            <span className="ml-3">Settings</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/help"
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 sm:px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                isActive
                  ? "text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm border border-green-100 font-semibold"
                  : "text-gray-600 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50"
              )
            }
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
            <span className="ml-3">Help Center</span>
            <Badge className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">24/7</Badge>
          </NavLink>
        </nav>
        
        {/* Logout Button - Enhanced */}
        <div className="p-4 sm:p-6 border-t border-gray-100/80 mt-auto">
          <Button
            variant="ghost"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="ml-3">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Search Sheet */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="top" className="h-auto">
          <SheetHeader>
            <SheetTitle>Search AgriSenti</SheetTitle>
            <SheetDescription>Find crops, weather data, market prices, and more</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
              <Input
                placeholder="Search crops, weather, markets..."
                className="pl-10 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent h-12"
                autoFocus
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Sprout className="w-4 h-4 mr-2" />
                Crops
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Cloud className="w-4 h-4 mr-2" />
                Weather
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Markets
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Scan className="w-4 h-4 mr-2" />
                Diseases
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content - Enhanced */}
      <div className={cn(
        "transition-all duration-300 pt-14 sm:pt-16 min-h-screen", // Account for the fixed header height
        isMobile ? "" : "ml-64"
      )}>
        {/* Page Content */}
        <main className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
          <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile floating action button - Enhanced */}
        {isMobile && !isSidebarOpen && (
          <Button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-4 right-4 z-20 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
            size="icon"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};
