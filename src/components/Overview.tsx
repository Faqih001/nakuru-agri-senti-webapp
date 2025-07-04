import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Sprout, Camera, TrendingUp, Calendar, Cloud, ChevronRight, AlertCircle, ArrowUp, ArrowDown, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const Overview = () => {
  const navigate = useNavigate();

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
    <div className="space-y-4 sm:space-y-6">
        {/* Stats section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-0 shadow-md overflow-hidden">
              <div className={cn("bg-gradient-to-br text-white h-full", stat.color)}>
                <CardHeader className="pb-0 pt-3 sm:pt-4 lg:pt-5 px-3 sm:px-4 lg:px-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm sm:text-base lg:text-lg font-medium opacity-90">{stat.title}</CardTitle>
                    <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 opacity-80">{stat.icon}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">{stat.value}</p>
                  <div className="flex items-center mt-1 sm:mt-2 text-xs sm:text-sm opacity-90">
                    {stat.trend === 'up' && <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                    {stat.trend === 'down' && <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
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
            <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                Alert Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start p-2 sm:p-3 rounded-lg border border-orange-200 bg-white"
                  >
                    <div className="flex-shrink-0 mr-2 sm:mr-3">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{alert.description}</p>
                    </div>
                    <div className="text-xs text-gray-400">{alert.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions - Show on mobile & tablet views but hide on desktop (shown in sidebar) */}
        <div className="lg:hidden">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <span>Quick Actions</span>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 text-green-600" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={index}
                  className={cn(
                    "bg-gradient-to-br border hover:shadow-lg transition-shadow cursor-pointer",
                    action.cardColor
                  )}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <div className="inline-flex p-2 sm:p-3 rounded-full bg-white/50 mb-2 sm:mb-4">
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{action.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">{action.description}</p>                          
                    <Button 
                      className={cn("w-full text-xs sm:text-sm", action.buttonColor)}
                      onClick={() => navigate(action.path)}
                    >
                      {action.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>      {/* Weather and AI cards in a responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Weather Card */}
        <Card className="shadow-md border border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white pb-2 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Cloud className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Weather Report
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full">
                  <Cloud className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">24°C</p>
                  <p className="text-xs sm:text-sm text-gray-600">Partly Cloudy</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium text-gray-800">Nakuru</p>
                <p className="text-xs text-gray-500">May 29, 2025</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 grid grid-cols-4 gap-1 sm:gap-2 text-center">
              {["Mon", "Tue", "Wed", "Thu"].map((day, i) => (
                <div key={i} className="bg-blue-50/50 rounded-lg p-1 sm:p-2">
                  <p className="text-xs font-medium text-gray-600">{day}</p>
                  <Cloud className="h-4 w-4 sm:h-5 sm:w-5 mx-auto my-1 text-blue-500" />
                  <p className="text-xs sm:text-sm font-medium">{22 + i}°C</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="shadow-md border border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white pb-2 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Best crops to plant next season:</p>
            <div className="space-y-2 sm:space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-center p-2 bg-purple-50/50 rounded-lg">
                  <div className="bg-purple-100 p-1 sm:p-1.5 rounded-md">
                    <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div className="ml-2 sm:ml-3 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-800">{rec.crop}</p>
                    <p className="text-xs text-gray-500">{rec.reason}</p>
                  </div>
                  <div className="bg-purple-100 text-purple-800 text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {rec.score}%
                  </div>
                </div>
              ))}
            </div>
            <Button 
              className="mt-3 sm:mt-4 w-full bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm"
              onClick={() => navigate("/dashboard/crop-assistant")}
            >
              See Full Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { action: "Added soil data", time: "Today, 10:23 AM" },
                { action: "Updated crop status", time: "Yesterday, 3:45 PM" },
                { action: "Viewed market prices", time: "Yesterday, 11:20 AM" },
                { action: "Scanned maize crop", time: "May 27, 2025" }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-xs sm:text-sm text-gray-800">{activity.action}</p>
                  </div>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
            <div className="p-3 sm:p-4 text-center border-t">
              <Button variant="link" className="text-green-600 text-xs sm:text-sm p-0">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 sm:space-y-2 p-3 sm:p-4 lg:p-6 pt-0">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={index} 
                  className={`w-full justify-start gap-2 sm:gap-3 text-left text-xs sm:text-sm ${action.buttonColor}`}
                  onClick={() => navigate(action.path)}
                >
                  <div className="bg-white/20 p-1 sm:p-1.5 rounded-md">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span>{action.title}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
