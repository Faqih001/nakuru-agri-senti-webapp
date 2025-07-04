import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThermometerSun, Wind, Droplets, Sun, CloudRain, Clock, AlertTriangle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormattedMessage } from "@/components/FormattedMessage";

export const WeatherDashboard = () => {
  // Initialize Gemini API with useMemo to prevent recreating on every render
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = useMemo(() => {
    if (!API_KEY) {
      console.error("VITE_GEMINI_API_KEY is not configured");
      return null;
    }
    return new GoogleGenerativeAI(API_KEY);
  }, [API_KEY]);
  
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
      if (!genAI) {
        setInsightError("AI service is not properly configured. Please check your API key.");
        return;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
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
        You are an agricultural weather expert for Nakuru County, Kenya. 
        
        **Format your response with clear structure using:**
        - Headings followed by colons (e.g., "Recommended Activities:")
        - Bullet points (•) for lists
        - Numbered steps for sequential actions
        
        Based on the following weather data for Nakuru, provide practical farming advice:
        
        ${weatherSummary}
        
        **Provide specific recommendations about:**
        
        **Recommended Activities:**
        - What farming activities are optimal in these conditions
        
        **Precautions:**
        - Any safety measures farmers should take
        
        **Irrigation Advice:**
        - Optimal watering schedule given the forecast
        
        **Pest & Disease Risks:**
        - Potential threats that might increase in these conditions
        
        Keep response under 200 words, practical, and specific to Nakuru's agricultural context.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log("Weather AI Response:", text);
      setFarmingInsight(text);
    } catch (error: any) {
      console.error("Error getting farming insights:", error);
      
      // Handle specific error types
      if (error?.message?.includes('API_KEY_INVALID')) {
        setInsightError("Invalid API key. Please check your configuration.");
      } else if (error?.message?.includes('QUOTA_EXCEEDED')) {
        setInsightError("AI service quota exceeded. Please try again later.");
      } else if (error?.message?.includes('fetch')) {
        setInsightError("Network error. Please check your internet connection.");
      } else {
        setInsightError("Failed to generate farming insights. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [genAI, weatherData]);
  
  // Get insights on initial load
  useEffect(() => {
    getFarmingInsights();
  }, [getFarmingInsights]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Weather Monitoring</h2>
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Current Weather */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-800">
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="flex items-center">
              <ThermometerSun className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1 sm:mr-2" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                {weatherData.current.temperature}°C
              </div>
            </div>
            <div className="text-xs sm:text-sm text-blue-600 mt-1">
              <span className="hidden sm:inline">{weatherData.current.condition}</span>
              <span className="sm:hidden">Partly Cloudy</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800">
              Wind Speed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="flex items-center">
              <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-1 sm:mr-2" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-900">
                {weatherData.current.windSpeed} <span className="text-xs sm:text-sm">km/h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-800">
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="flex items-center">
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-1 sm:mr-2" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
                {weatherData.current.humidity}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-amber-800">
              UV Index
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="flex items-center">
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mr-1 sm:mr-2" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900">
                {weatherData.current.uv}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-amber-600 mt-1">Moderate</div>
          </CardContent>
        </Card>
      </div>

      {/* Weather Forecast */}
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <CardTitle className="text-base sm:text-lg">5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-2 sm:p-3 lg:p-4 rounded-lg bg-gray-50"
              >
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
                  {day.day}
                </span>
                <day.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 my-2 text-gray-600" />
                <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">
                  {day.temp}°C
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* AI-Powered Farming Insights */}
      <Card className="mt-4 sm:mt-6">
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <span>AI-Powered Farming Insights</span>
            {loading && (
              <div className="inline-block h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-solid border-green-600 border-r-transparent"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          {insightError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm">{insightError}</AlertDescription>
            </Alert>
          ) : loading ? (
            <div className="h-16 sm:h-24 flex items-center justify-center">
              <div className="text-xs sm:text-sm text-gray-500">Generating farming insights...</div>
            </div>
          ) : (
            <>
              <div className="prose prose-sm max-w-none">
                <FormattedMessage 
                  content={farmingInsight} 
                  className="text-gray-700"
                />
              </div>
              <div className="mt-3 sm:mt-4 text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={getFarmingInsights}
                  disabled={loading}
                  className="text-green-600 border-green-600 hover:bg-green-50 text-xs sm:text-sm"
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
