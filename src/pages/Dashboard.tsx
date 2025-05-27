
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CropAssistant } from "@/components/CropAssistant";
import { DiseaseDetection } from "@/components/DiseaseDetection";
import { MarketDashboard } from "@/components/MarketDashboard";
import { ProfileCompletionDialog } from "@/components/ProfileCompletionDialog";
import { Sprout, Camera, TrendingUp, Settings, Bell, LogOut, User, BarChart, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const { user, signOut, loading, showProfileCompletion } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assistant");

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
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          <span className="text-green-700">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const userInitials = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      {/* Profile Completion Dialog */}
      <ProfileCompletionDialog open={showProfileCompletion} />
      
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl shadow-lg">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
                  AgriSenti Dashboard
                </h1>
                <p className="text-sm text-green-600">Smart Farming Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-100/50">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-100/50">
                <Settings className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200/50">
                <Avatar>
                  <AvatarImage className="bg-green-600 text-white">
                    {userInitials}
                  </AvatarImage>
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-green-800">Welcome back!</div>
                  <div className="text-xs text-green-600">{user.email}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-green-700 hover:bg-red-100/50 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Farm Score</p>
                  <p className="text-3xl font-bold">92/100</p>
                </div>
                <BarChart className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Crops</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <Sprout className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">This Month</p>
                  <p className="text-3xl font-bold">KES 85K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Next Task</p>
                  <p className="text-lg font-bold">Fertilize Maize</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">
              Your Smart Farming Command Center
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-green-50/50 backdrop-blur-sm h-auto rounded-none border-b">
                <TabsTrigger 
                  value="assistant" 
                  className="flex items-center gap-2 p-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
                >
                  <Sprout className="w-5 h-5" />
                  <span className="hidden sm:inline">AI Crop Assistant</span>
                  <span className="sm:hidden">Assistant</span>
                  <Badge variant="secondary" className="ml-2">NEW</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="detection" 
                  className="flex items-center gap-2 p-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
                >
                  <Camera className="w-5 h-5" />
                  <span className="hidden sm:inline">Disease Detection</span>
                  <span className="sm:hidden">Detection</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="market" 
                  className="flex items-center gap-2 p-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="hidden sm:inline">Market Intelligence</span>
                  <span className="sm:hidden">Market</span>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="assistant" className="space-y-4 mt-0">
                  <CropAssistant />
                </TabsContent>

                <TabsContent value="detection" className="space-y-4 mt-0">
                  <DiseaseDetection />
                </TabsContent>

                <TabsContent value="market" className="space-y-4 mt-0">
                  <MarketDashboard />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Sprout className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-green-800 mb-2">Add New Crop</h3>
              <p className="text-sm text-green-600 mb-4">Register a new crop for monitoring</p>
              <Button className="bg-green-600 hover:bg-green-700 w-full">
                Add Crop
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Camera className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-800 mb-2">Quick Scan</h3>
              <p className="text-sm text-blue-600 mb-4">Scan for diseases instantly</p>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                Start Scan
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-100 to-red-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-orange-800 mb-2">Market Alert</h3>
              <p className="text-sm text-orange-600 mb-4">Set price alerts for your crops</p>
              <Button className="bg-orange-600 hover:bg-orange-700 w-full">
                Set Alert
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
