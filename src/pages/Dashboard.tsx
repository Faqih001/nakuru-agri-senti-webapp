import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  ArrowDown
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { user, signOut, loading, showProfileCompletion } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assistant");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
      icon: <Sprout className="w-12 h-12 text-green-600" />,
      buttonText: "Add Crop",
      buttonColor: "bg-green-600 hover:bg-green-700",
      cardColor: "from-green-100 to-emerald-100 border-green-200"
    },
    {
      title: "Quick Scan",
      description: "Scan for diseases instantly",
      icon: <Camera className="w-12 h-12 text-blue-600" />,
      buttonText: "Start Scan",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      cardColor: "from-blue-100 to-cyan-100 border-blue-200"
    },
    {
      title: "Market Alert",
      description: "Set price alerts for your crops",
      icon: <TrendingUp className="w-12 h-12 text-orange-600" />,
      buttonText: "Set Alert",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      cardColor: "from-orange-100 to-red-100 border-orange-200"
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
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
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
            
            <div className="flex items-center gap-3">
              {/* Weather widget */}
              <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{weatherData.temperature}°C</span>
                <span className="text-xs text-blue-600">{weatherData.condition}</span>
              </div>
              
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </div>
              
              <div className="flex items-center gap-3 border border-gray-200 px-3 py-1.5 rounded-full">
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

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown as overlay */}
        <aside 
          className={cn(
            "bg-white border-r border-gray-100 w-64 fixed inset-y-0 left-0 z-40 transition-transform duration-200 ease-in-out transform lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="sticky top-0 p-4 space-y-6">
            {/* Close button - mobile only */}
            <div className="lg:hidden flex justify-end">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
            
            {/* User profile section */}
            <div className="flex flex-col items-center space-y-3 py-4 border-b border-gray-100">
              <Avatar className="h-16 w-16 ring-2 ring-green-600 ring-offset-2">
                <AvatarFallback className="bg-green-600 text-white text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium">{user.email?.split('@')[0]}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Farmer
              </Badge>
            </div>
            
            {/* Sidebar navigation */}
            <nav className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                Main
              </p>
              {[
                { label: "Overview", icon: BarChart, active: true },
                { label: "Crops", icon: Sprout, active: false },
                { label: "Disease Detection", icon: Camera, active: false },
                { label: "Weather", icon: Cloud, active: false },
                { label: "Market", icon: TrendingUp, active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors",
                    item.active
                      ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", item.active ? "text-green-600" : "text-gray-500")} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.active && <div className="ml-auto w-1.5 h-6 bg-green-500 rounded-full" />}
                </button>
              ))}
              
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2 mt-6">
                Settings
              </p>
              {[
                { label: "Profile", icon: User, active: false },
                { label: "Settings", icon: Settings, active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors",
                    item.active
                      ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  <item.icon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Upgrade card */}
            <div className="mt-auto">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg border-0">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold">Upgrade to Pro</h3>
                  <p className="text-xs text-green-100">Get advanced analytics and AI predictions</p>
                  <Button className="w-full bg-white text-green-800 hover:bg-green-50">
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)} 
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 px-4 py-6 lg:py-8 overflow-auto">
          <div className="container mx-auto max-w-6xl space-y-8">
            {/* Page title and location */}
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
                  <Cloud className="w-4 h-4 mr-1.5" /> Weather Report
                </Button>
                <Button variant="outline" size="sm" className="border-green-200 text-green-700">
                  <TrendingUp className="w-4 h-4 mr-1.5" /> Market Prices
                </Button>
              </div>
            </div>
            
            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <Card key={i} className="border-0 shadow-md overflow-hidden">
                  <div className={cn("bg-gradient-to-br text-white h-full", stat.color)}>
                    <CardHeader className="pb-0 pt-5">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-medium opacity-90">{stat.title}</CardTitle>
                        <div className="bg-white/20 p-2 rounded-lg">
                          {stat.icon}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      <div className="flex items-center mt-2 text-sm opacity-90">
                        {stat.trend === 'up' && <ArrowUp className="w-4 h-4 mr-1" />}
                        {stat.trend === 'down' && <ArrowDown className="w-4 h-4 mr-1" />}
                        <span>{stat.change}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Alerts section */}
            {alerts.length > 0 && (
              <Card className="shadow-md border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Alert Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="flex items-start p-3 rounded-lg border border-orange-200 bg-white"
                      >
                        <div className="flex-shrink-0 mr-3">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                          <p className="text-sm text-gray-500">{alert.description}</p>
                        </div>
                        <div className="text-xs text-gray-400">{alert.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Main Dashboard Tabs */}
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    Smart Farming Assistant
                  </CardTitle>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    AI Powered
                  </Badge>
                </div>
                <CardDescription className="text-green-100 mt-1">
                  Get real-time assistance for your farming needs
                </CardDescription>
              </CardHeader>
              
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b">
                    <div className="container">
                      <TabsList className="bg-transparent h-auto p-0 flex w-full overflow-x-auto no-scrollbar">
                        <TabsTrigger 
                          value="assistant" 
                          className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none py-3 px-6 text-gray-600"
                        >
                          <div className="flex items-center gap-2">
                            <Sprout className="w-5 h-5" />
                            <span className="whitespace-nowrap">AI Crop Assistant</span>
                          </div>
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">NEW</Badge>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="detection" 
                          className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none py-3 px-6 text-gray-600"
                        >
                          <div className="flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            <span className="whitespace-nowrap">Disease Detection</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="market" 
                          className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none py-3 px-6 text-gray-600"
                        >
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            <span className="whitespace-nowrap">Market Intelligence</span>
                          </div>
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <TabsContent value="assistant" className="mt-0">
                      <CropAssistant />
                    </TabsContent>

                    <TabsContent value="detection" className="mt-0">
                      <DiseaseDetection />
                    </TabsContent>

                    <TabsContent value="market" className="mt-0">
                      <MarketDashboard />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </Card>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span>Quick Actions</span>
                <ChevronRight className="h-5 w-5 ml-1 text-green-600" />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Card 
                    key={index}
                    className={cn(
                      "bg-gradient-to-br border hover:shadow-lg transition-shadow",
                      action.cardColor
                    )}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-3 rounded-full bg-white/50 mb-4">
                        {action.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                      <Button className={cn("w-full", action.buttonColor)}>
                        {action.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile navigation bar */}
      <div className="lg:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40">
        <div className="grid grid-cols-5 gap-1">
          {[
            { icon: BarChart, label: "Overview", active: true },
            { icon: Sprout, label: "Crops", active: false },
            { icon: Camera, label: "Detect", active: false },
            { icon: Cloud, label: "Weather", active: false },
            { icon: User, label: "Profile", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex flex-col items-center py-2 px-1",
                item.active ? "text-green-600" : "text-gray-500"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
