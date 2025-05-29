import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThermometerSun, Wind, Droplets, Sun, CloudRain, Clock, AlertTriangle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const WeatherDashboard = () => {
  // Mock data
  const weatherData = {
    current: {
      temperature: 24,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      precipitation: 0,
      uv: 5,
    },
    forecast: [
      { day: "Today", temp: 24, icon: Sun },
      { day: "Tomorrow", temp: 23, icon: CloudRain },
      { day: "Wednesday", temp: 25, icon: Sun },
      { day: "Thursday", temp: 22, icon: CloudRain },
      { day: "Friday", temp: 24, icon: Sun },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Weather Monitoring</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Current Weather */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ThermometerSun className="w-5 h-5 text-blue-600 mr-2" />
              <div className="text-2xl font-bold text-blue-900">
                {weatherData.current.temperature}°C
              </div>
            </div>
            <div className="text-sm text-blue-600 mt-1">
              {weatherData.current.condition}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">
              Wind Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wind className="w-5 h-5 text-emerald-600 mr-2" />
              <div className="text-2xl font-bold text-emerald-900">
                {weatherData.current.windSpeed} km/h
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Droplets className="w-5 h-5 text-purple-600 mr-2" />
              <div className="text-2xl font-bold text-purple-900">
                {weatherData.current.humidity}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              UV Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Sun className="w-5 h-5 text-amber-600 mr-2" />
              <div className="text-2xl font-bold text-amber-900">
                {weatherData.current.uv}
              </div>
            </div>
            <div className="text-sm text-amber-600 mt-1">Moderate</div>
          </CardContent>
        </Card>
      </div>

      {/* Weather Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-600">
                  {day.day}
                </span>
                <day.icon className="w-8 h-8 my-2 text-gray-600" />
                <span className="text-lg font-bold text-gray-800">
                  {day.temp}°C
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
