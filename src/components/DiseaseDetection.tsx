import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DiseaseDetailsCard } from "./DiseaseDetailsCard";

interface AnalysisResult {
  disease: string;
  confidence: number;
  severity: string;
  description: string;
  treatment: string;
  prevention: string;
}

export const DiseaseDetection = () => {
  // Initialize Gemini API
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    if (!genAI) {
      toast({
        title: "API Configuration Error",
        description: "Gemini API key is not configured. Please check your environment variables.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Get the generative model with vision capability
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Convert base64 image to correct format for Gemini API
      const base64String = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(',')[0].split(':')[1].split(';')[0];
      
      // Create image part for the model
      const imageParts = [
        {
          inlineData: {
            data: base64String,
            mimeType: mimeType,
          },
        },
      ];
      
      // Create prompt for plant disease analysis
      const prompt = `
      You are an expert agricultural pathologist specializing in crop diseases in Kenya, particularly the Nakuru region.
      
      Analyze this crop image and provide a detailed assessment in the following JSON format:
      
      {
        "disease": "Disease/Pest Name (if any)",
        "confidence": 85,
        "severity": "Low/Medium/High/None",
        "description": "Detailed description of what you observe",
        "treatment": "Specific treatment recommendations for Kenya",
        "prevention": "Prevention strategies for Nakuru farmers"
      }
      
      Important guidelines:
      - If the plant appears healthy, set disease to "Healthy Plant" and severity to "None"
      - Use confidence levels from 0-100
      - Provide practical, locally-relevant advice for Kenyan farmers
      - Mention specific products or practices available in Kenya when possible
      - Consider common crops in Nakuru: maize, beans, potatoes, wheat, barley
      
      Return ONLY the JSON object, no additional text.
      `;
      
      // Generate content with the image
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      
      console.log("AI Response:", text); // For debugging
      
      // Parse the JSON response
      let parsedResult: AnalysisResult;
      
      try {
        // Clean the response text (remove any markdown formatting)
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonResponse = JSON.parse(cleanText);
        
        parsedResult = {
          disease: jsonResponse.disease || "Unknown Issue",
          confidence: jsonResponse.confidence || 70,
          severity: jsonResponse.severity || "Medium",
          description: jsonResponse.description || "Analysis could not determine the specific issue.",
          treatment: jsonResponse.treatment || "Consult with a local agricultural extension officer for specific recommendations.",
          prevention: jsonResponse.prevention || "Regular monitoring and proper farm hygiene practices."
        };
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        console.log("Raw response:", text);
        
        // Fallback: Try to extract information using regex if JSON parsing fails
        const diseaseName = text.match(/disease[\"']?\s*:\s*[\"']?([^\"',\n]+)/i)?.[1] || "Analysis Inconclusive";
        const confidenceMatch = text.match(/confidence[\"']?\s*:\s*(\d+)/i);
        const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 70;
        const severityMatch = text.match(/severity[\"']?\s*:\s*[\"']?(none|low|medium|high)[\"']?/i);
        const severity = severityMatch ? severityMatch[1].charAt(0).toUpperCase() + severityMatch[1].slice(1) : "Medium";
        
        parsedResult = {
          disease: diseaseName,
          confidence: confidence,
          severity: severity,
          description: "The AI analysis provided an unclear response. Please try uploading a clearer image or consult with an agricultural expert.",
          treatment: "Consider taking a clearer photo with better lighting, or consult with a local agricultural extension officer.",
          prevention: "Regular crop monitoring and maintaining good farm hygiene practices."
        };
      }
      
      setAnalysisResult(parsedResult);
      
      toast({
        title: "Analysis Complete",
        description: `Detected: ${parsedResult.disease} (${parsedResult.confidence}% confidence)`,
        variant: parsedResult.severity === "High" ? "destructive" : "default",
      });
      
    } catch (error) {
      console.error("Error analyzing image with Gemini:", error);
      
      let errorMessage = "Could not analyze the image. Please try again later.";
      
      if (error instanceof Error) {
        if (error.message.includes("API_KEY")) {
          errorMessage = "Invalid API key. Please check your Gemini API configuration.";
        } else if (error.message.includes("quota")) {
          errorMessage = "API quota exceeded. Please try again later.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your internet connection.";
        }
      }
      
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Format treatment and prevention strings to arrays
  const formatTextToArray = (text: string): string[] => {
    if (!text) return [];
    // Split by common delimiters and clean up
    return text.split(/[|•\n]/).map(item => item.trim()).filter(item => item.length > 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-green-600 text-white p-3 sm:p-4 lg:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            Disease Detection
          </CardTitle>
          <p className="text-green-100 text-xs sm:text-sm">
            Upload a photo of your crop to detect diseases
          </p>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Uploaded crop" 
                  className="max-h-48 sm:max-h-56 lg:max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto text-gray-400" />
                  <p className="text-gray-600 text-sm sm:text-base">Click to upload crop image</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    JPG, PNG up to 10MB
                  </p>
                </div>
              )}
            </div>
            
            <label htmlFor="disease-image-upload" className="sr-only">
              Upload an image for disease detection
            </label>
            <input
              id="disease-image-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              aria-label="Upload an image for disease detection"
            />
            
            <Button 
              onClick={analyzeImage}
              disabled={!selectedImage || isAnalyzing || !genAI}
              className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-2.5"
            >
              {isAnalyzing ? "Analyzing..." : !genAI ? "API Not Configured" : "Analyze Image"}
            </Button>
            
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p><strong>Tips for best results:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Take clear, well-lit photos</li>
                <li>Focus on affected leaves or stems</li>
                <li className="hidden sm:list-item">Include multiple angles if possible</li>
                <li>Avoid blurry or dark images</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing ? (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-center py-8 sm:py-12 lg:py-16">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-green-600 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Analyzing image...</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                Our AI is examining your crop for diseases and pests
              </p>
            </div>
          </CardContent>
        </Card>
      ) : analysisResult ? (
        <DiseaseDetailsCard
          diseaseName={analysisResult.disease}
          confidence={analysisResult.confidence}
          severity={analysisResult.severity as "High" | "Medium" | "Low" | "None"}
          description={analysisResult.description}
          treatment={formatTextToArray(analysisResult.treatment)}
          prevention={formatTextToArray(analysisResult.prevention)}
        />
      ) : (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-center py-8 sm:py-12 lg:py-16 text-gray-500">
              <Camera className="w-8 h-8 sm:w-10 sm:w-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
              <p className="text-sm sm:text-base">Upload an image to get started</p>
              <p className="text-xs sm:text-sm mt-1">
                Our AI will analyze your crop and provide treatment recommendations
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
