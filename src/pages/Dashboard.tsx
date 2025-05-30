import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CropAssistant } from "@/components/CropAssistant";
import { DiseaseDetection } from "@/components/DiseaseDetection";
import { MarketDashboard } from "@/components/MarketDashboard";
import { ProfileCompletionDialog } from "@/components/ProfileCompletionDialog";
import { 
  Sprout, 
  Camera, 
  TrendingUp, 
  Settings, 
  Bell, 
  LogOut, 
  User, 
  BarChart, 
  Calendar, 
  Loader2, 
  Cloud, 
  Menu, 
  MapPin,
  ChevronRight,
  AlertCircle,
  PieChart,
  ArrowUp,
  ArrowDown,
  X,
  LineChart,
  Clock,
  Zap,
  RefreshCw,
  HelpCircle,
  BookOpen,
  PhoneCall
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { user, signOut, loading, showProfileCompletion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("assistant");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Weather data - would be fetched from an API in a real app
  const weatherData = {
    temperature: 24,
    condition: "Partly Cloudy",
    forecast: "Sunny tomorrow"
  };
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/landing");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-t-green-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sprout className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <span className="text-green-800 font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const userInitials = user.email?.charAt(0).toUpperCase() || 'U';

  // Farm stats data
  const stats = [
    {
      title: "Farm Score",
      value: "92/100",
      color: "from-green-500 to-emerald-600",
      icon: <BarChart className="w-8 h-8 opacity-80" />,
      change: "+5% from last month",
      trend: "up"
    },
    {
      title: "Active Crops",
      value: "8",
      color: "from-blue-500 to-cyan-600",
      icon: <Sprout className="w-8 h-8 opacity-80" />,
      change: "2 new since last month",
      trend: "up"
    },
    {
      title: "Revenue",
      value: "KES 85K",
      color: "from-orange-500 to-red-600",
      icon: <TrendingUp className="w-8 h-8 opacity-80" />,
      change: "+12.5% YoY",
      trend: "up"
    },
    {
      title: "Next Task",
      value: "Fertilize Maize",
      color: "from-purple-500 to-pink-600",
      icon: <Calendar className="w-8 h-8 opacity-80" />,
      change: "Due in 2 days",
      trend: "neutral"
    }
  ];
  
  // Quick action cards
  const quickActions = [
    {
      title: "Add New Crop",
      description: "Register a new crop for monitoring",
      icon: Sprout,
      buttonText: "Add Crop",
      buttonColor: "bg-green-600 hover:bg-green-700",
      cardColor: "from-green-100 to-emerald-100 border-green-200",
      path: "/dashboard/crop-assistant"
    },
    {
      title: "Quick Scan",
      description: "Scan for diseases instantly",
      icon: Camera,
      buttonText: "Start Scan",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      cardColor: "from-blue-100 to-cyan-100 border-blue-200",
      path: "/dashboard/disease-detection"
    },
    {
      title: "Market Alert",
      description: "Set price alerts for your crops",
      icon: TrendingUp,
      buttonText: "Set Alert",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      cardColor: "from-orange-100 to-red-100 border-orange-200",
      path: "/dashboard/market"
    }
  ];

  // Alert notifications
  const alerts = [
    {
      title: "Potential Pest Detection",
      description: "AI detected potential aphid infestation in your maize crop",
      type: "warning",
      time: "2 hours ago"
    },
    {
      title: "Weather Alert",
      description: "Heavy rainfall expected tomorrow. Consider postponing fertilizer application",
      type: "info",
      time: "5 hours ago"
    }
  ];

  // Next planting recommendations
  const recommendations = [
    {
      crop: "Cabbage",
      score: 95,
      reason: "Optimal climate and soil conditions"
    },
    {
      crop: "Sweet Potatoes",
      score: 88,
      reason: "Good market prices and suitable soil"
    },
    {
      crop: "Beans",
      score: 83,
      reason: "Good for crop rotation after maize"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Profile Completion Dialog */}
      <ProfileCompletionDialog open={showProfileCompletion} />
      
      {/* Modern Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hover:bg-green-50 lg:hover:text-green-600 relative lg:bg-transparent bg-green-50 lg:text-inherit text-green-600"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar menu"
              >
                <Menu className="h-5 w-5" />
                <span className="lg:hidden absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg shadow-lg">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
                    AgriSenti
                  </h1>
                  <p className="text-xs text-green-600">Smart Farming Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Weather widget */}
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{weatherData.temperature}°C</span>
                <span className="text-xs text-blue-600 hidden md:inline-block">{weatherData.condition}</span>
              </div>
              
              {/* Help & Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5 border-green-200 text-green-700">
                    <HelpCircle className="w-4 h-4" /> 
                    <span>Help & Resources</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Get help with AgriSenti dashboard and features</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/dashboard/help?tab=tutorials")}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>View Tutorials</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/dashboard/help?tab=support")}>
                    <PhoneCall className="w-4 h-4 mr-2" />
                    <span>Contact Support</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Quick Actions Button */}
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5 border-green-200 text-green-700">
                <Zap className="w-4 h-4" /> 
                <span>Quick Actions</span>
              </Button>
              
              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center gap-2 sm:gap-3 border border-gray-200 px-2 sm:px-3 py-1.5 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-600 text-white text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">Welcome back!</div>
                  <div className="text-xs text-gray-500 max-w-[150px] truncate">{user.email}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar - Hidden on mobile, shown as overlay */}
        <aside 
          className={cn(
            "bg-white border-r border-gray-100 w-80 fixed inset-y-0 pt-16 left-0 z-50 transition-all duration-300 ease-in-out transform lg:relative lg:translate-x-0 lg:pt-0 lg:w-64",
            sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          )}
        >
          <div className="sticky top-0 p-4 pb-16 space-y-6 h-[calc(100vh-3.5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent">
            {/* Close button - mobile only */}
            <div className="lg:hidden flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1.5 rounded-md">
                  <Menu className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-700">Navigation Menu</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:bg-green-50 hover:text-green-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* User profile section */}
            <div className="flex flex-col items-center space-y-3 py-5 mb-2 border-b border-gray-100">
              <Avatar className="h-20 w-20 ring-2 ring-green-600 ring-offset-2 hover:ring-green-500 transition-all shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-700 text-white text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium text-base">{user.email?.split('@')[0]}</p>
                <p className="text-xs text-gray-500 mt-0.5 max-w-[180px] truncate">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
                  Farmer
                </Badge>
                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 font-medium">
                  Free Plan
                </Badge>
              </div>
            </div>
            
            {/* Sidebar navigation */}
            <nav className="space-y-1.5 mt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
                Main
              </p>
              {[
                { label: "Overview", icon: BarChart, path: "/dashboard", active: location.pathname === "/dashboard" },
                { label: "Crops", icon: Sprout, path: "/dashboard/crop-assistant", active: location.pathname === "/dashboard/crop-assistant" },
                { label: "Disease Detection", icon: Camera, path: "/dashboard/disease-detection", active: location.pathname === "/dashboard/disease-detection" },
                { label: "Weather", icon: Cloud, path: "/dashboard/weather", active: location.pathname === "/dashboard/weather" },
                { label: "Market", icon: TrendingUp, path: "/dashboard/market", active: location.pathname === "/dashboard/market" },
                { label: "Help & Resources", icon: HelpCircle, path: "/dashboard/help", active: location.pathname === "/dashboard/help" },
              ].map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3.5 lg:py-2.5 rounded-lg transition-all",
                    item.active
                      ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800 shadow-sm"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-md",
                    item.active ? "bg-green-100" : "bg-gray-100"
                  )}>
                    <item.icon className={cn("w-5 h-5", item.active ? "text-green-600" : "text-gray-500")} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.active && <div className="ml-auto w-1.5 h-6 bg-green-500 rounded-full" />}
                </button>
              ))}
              
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 mt-6">
                Settings
              </p>
              {[
                { label: "Profile", icon: User, path: "/dashboard/profile", active: location.pathname === "/dashboard/profile" },
                { label: "Settings", icon: Settings, path: "/dashboard/settings", active: location.pathname === "/dashboard/settings" },
              ].map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3.5 lg:py-2.5 rounded-lg transition-all",
                    item.active
                      ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100">
                    <item.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Help & Resources Section */}
            <div className="pt-4 mt-6 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
                Help & Resources
              </p>
              {[
                { label: "View Tutorials", icon: BookOpen, path: "/dashboard/help?tab=tutorials" },
                { label: "Contact Support", icon: PhoneCall, path: "/dashboard/help?tab=support" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-3 w-full px-4 py-3.5 lg:py-2.5 rounded-lg transition-all hover:bg-gray-50 text-gray-700"
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100">
                    <item.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            
            {/* Upgrade card */}
            <div className="mt-auto pt-4">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 rounded-full bg-green-400/30 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 -mb-8 -ml-8 rounded-full bg-emerald-400/30 blur-xl"></div>
                <CardContent className="p-5 space-y-3 relative z-10">
                  <h3 className="font-semibold text-lg">Upgrade to Pro</h3>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-white/20 text-white">Premium</Badge>
                    <Badge className="bg-white/20 text-white">AI Features</Badge>
                  </div>
                  <p className="text-xs text-green-100">Get advanced analytics, AI predictions, and market insights.</p>
                  <Button 
                    className="w-full bg-white text-green-800 hover:bg-green-50 font-medium shadow-md"
                    onClick={() => window.open('https://agrisenti.com/pricing', '_blank')}
                  >
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        <div 
          className={cn(
            "fixed inset-0 bg-black/50 lg:hidden z-40 transition-opacity duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setSidebarOpen(false)} 
          aria-hidden="true"
        />
        
        {/* Mobile floating action button - only visible when sidebar is closed */}
        <div 
          className={cn(
            "fixed bottom-6 right-6 z-30 bg-green-600 p-3 rounded-full shadow-xl lg:hidden transition-all duration-300",
            sidebarOpen ? "opacity-0 pointer-events-none translate-y-10" : "opacity-100 hover:bg-green-700"
          )}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 text-white" />
          <span className="sr-only">Open navigation menu</span>
        </div>
        
        {/* Main content */}
        <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 lg:py-8 overflow-auto pb-8">
          <div className="container mx-auto max-w-6xl space-y-6">
            {/* Page title and location */}
            {location.pathname === "/dashboard" ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">Nakuru County, Kenya</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700">
                    <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Data
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Sprout className="w-4 h-4 mr-1.5" /> New Season
                  </Button>
                </div>
              </div>
            ) : null}

            <Outlet />
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
