
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sprout, Camera, TrendingUp, ThermometerSun, Droplets, Wind, AlertTriangle, CheckCircle, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const DemoDashboard = () => {
  const weatherData = {
    temperature: 24,
    humidity: 68,
    windSpeed: 12,
    condition: "Partly Cloudy"
  };

  const cropData = [
    { name: "Maize", stage: "Flowering", progress: 75, health: "Good", icon: <Sprout className="w-4 h-4" /> },
    { name: "Beans", stage: "Pod Formation", progress: 60, health: "Excellent", icon: <Sprout className="w-4 h-4" /> },
    { name: "Tomatoes", stage: "Fruiting", progress: 85, health: "Needs Attention", icon: <Camera className="w-4 h-4" /> }
  ];

  const marketPrices = [
    { crop: "Maize", price: "KES 45/kg", change: "+5%", trend: "up" },
    { crop: "Beans", price: "KES 120/kg", change: "+2%", trend: "up" },
    { crop: "Tomatoes", price: "KES 80/kg", change: "-3%", trend: "down" }
  ];

  const alerts = [
    { type: "warning", message: "Late blight risk detected in tomato field", time: "2 hours ago" },
    { type: "success", message: "Optimal planting conditions for next week", time: "1 day ago" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Farm Dashboard Preview</h3>
          <p className="text-gray-600">Experience the power of smart farming analytics</p>
        </div>
        <Link to="/auth">
          <Button className="bg-green-600 hover:bg-green-700">
            Get Full Access
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Weather Widget */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <ThermometerSun className="w-4 h-4" />
              Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{weatherData.temperature}°C</div>
            <div className="text-sm text-blue-700">{weatherData.condition}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {weatherData.humidity}%
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                {weatherData.windSpeed}km/h
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">12</div>
            <div className="text-sm text-green-700">3 varieties</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Farm Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">8.5</div>
            <div className="text-sm text-orange-700">acres</div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">KES 450K</div>
            <div className="text-sm text-purple-700">this season</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Crop Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-600" />
              Crop Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cropData.map((crop, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {crop.icon}
                    <span className="font-medium">{crop.name}</span>
                  </div>
                  <Badge variant={crop.health === "Excellent" ? "default" : crop.health === "Good" ? "secondary" : "destructive"}>
                    {crop.health}
                  </Badge>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{crop.stage}</span>
                    <span>{crop.progress}%</span>
                  </div>
                  <Progress value={crop.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Market Prices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Market Prices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {marketPrices.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{item.crop}</span>
                <div className="text-right">
                  <div className="font-bold">{item.price}</div>
                  <div className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              {alert.type === "warning" ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center bg-green-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-green-800 mb-2">
          Ready to transform your farming?
        </h4>
        <p className="text-green-700 mb-4">
          Get access to personalized recommendations, disease detection, and market connections.
        </p>
        <Link to="/auth">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Start Your Free Trial
          </Button>
        </Link>
      </div>
    </div>
  );
};
