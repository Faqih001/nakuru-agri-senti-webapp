import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThermometerSun, Wind, Droplets, Sun, CloudRain, Clock, AlertTriangle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const WeatherDashboard = () => {
  // Initialize Gemini API with useMemo to prevent recreating on every render
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDEFsF9visXbuZfNEvtPvC8wI_deQBH-ro";
  const genAI = useMemo(() => new GoogleGenerativeAI(API_KEY), [API_KEY]);
  
  const [loading, setLoading] = useState(false);
  const [farmingInsight, setFarmingInsight] = useState("");
  const [insightError, setInsightError] = useState("");
  
  // Mock data for weather - we'll keep this since real weather API integration would be separate
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
  
  // Get farming insights based on weather data using Gemini API
  const getFarmingInsights = useCallback(async () => {
    setLoading(true);
    setInsightError("");
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const weatherSummary = `
        Current weather in Nakuru: ${weatherData.current.temperature}°C, ${weatherData.current.condition}
        Humidity: ${weatherData.current.humidity}%
        Wind Speed: ${weatherData.current.windSpeed} km/h
        Precipitation: ${weatherData.current.precipitation} mm
        
        5-Day Forecast:
        - Today: ${weatherData.forecast[0].temp}°C
        - Tomorrow: ${weatherData.forecast[1].temp}°C
        - Wednesday: ${weatherData.forecast[2].temp}°C
        - Thursday: ${weatherData.forecast[3].temp}°C
        - Friday: ${weatherData.forecast[4].temp}°C
      `;
      
      const prompt = `
        Based on the following weather data for Nakuru, Kenya, provide practical farming advice
        for local farmers. Consider seasonal crops common in Nakuru County, such as maize, beans,
        potatoes, and vegetables.
        
        ${weatherSummary}
        
        Provide specific recommendations about:
        1. What farming activities are recommended in these weather conditions
        2. Any precautions farmers should take
        3. Optimal irrigation advice given the forecast
        4. Pest or disease risks that might increase in these conditions
        
        Keep your response under 200 words, practical, and specific to Nakuru's agricultural context.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setFarmingInsight(text);
    } catch (error) {
      console.error("Error getting farming insights:", error);
      setInsightError("Failed to generate farming insights. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [genAI, weatherData]);
  
  // Get insights on initial load
  useEffect(() => {
    getFarmingInsights();
  }, [getFarmingInsights]);

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
      
      {/* AI-Powered Farming Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>AI-Powered Farming Insights</span>
            {loading && (
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-green-600 border-r-transparent"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insightError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{insightError}</AlertDescription>
            </Alert>
          ) : loading ? (
            <div className="h-24 flex items-center justify-center">
              <div className="text-sm text-gray-500">Generating farming insights...</div>
            </div>
          ) : (
            <>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line text-gray-700">{farmingInsight}</p>
              </div>
              <div className="mt-4 text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={getFarmingInsights}
                  disabled={loading}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  {loading ? "Updating..." : "Update Insights"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
