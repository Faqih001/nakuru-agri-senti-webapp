
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDEFsF9visXbuZfNEvtPvC8wI_deQBH-ro";
  const genAI = new GoogleGenerativeAI(API_KEY);
  
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

    setIsAnalyzing(true);
    
    try {
      // Get the generative model with vision capability (upgraded to Gemini-2.0-flash)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Convert base64 image to correct format for Gemini API
      // Remove the prefix (e.g., "data:image/jpeg;base64,")
      const base64String = selectedImage.split(',')[1];
      
      // Create image part for the model
      const imageParts = [
        {
          inlineData: {
            data: base64String,
            mimeType: "image/jpeg", // Adjust based on actual image type if needed
          },
        },
      ];
      
      // Create prompt for plant disease analysis
      const prompt = `
      Analyze this crop image for any signs of disease or pest infestation. 
      Focus on identifying common plant diseases and pests in Nakuru, Kenya.
      
      For any identified issue, provide the following information in a structured format:
      1. Disease/pest name
      2. Confidence level (as a percentage)
      3. Severity level (None, Low, Medium, High)
      4. Brief description of what you're seeing
      5. Recommended treatment options
      6. Prevention measures
      
      If the plant appears healthy, please indicate that as well.
      Provide your analysis in a structured format that can be easily parsed.
      `;
      
      // Generate content with the image
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response to extract structured information
      // This is a simplified parsing - you may need to adjust based on actual response format
      let parsedResult: AnalysisResult;
      
      try {
        // For demonstration, we'll use regex to extract information
        // In a production app, you might want to be more precise with parsing
        const diseaseName = text.match(/disease\/pest name:?\s*([^\n]+)/i)?.[1] || "Unknown Issue";
        const confidenceMatch = text.match(/confidence:?\s*(\d+)%?/i);
        const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 80;
        const severityMatch = text.match(/severity:?\s*(none|low|medium|high)/i);
        const severity = (severityMatch ? severityMatch[1].charAt(0).toUpperCase() + severityMatch[1].slice(1) : "Medium");
        const description = text.match(/description:?\s*([^\n]+(\n[^\n]+)*?)(\n\n|\n[a-z]+:)/i)?.[1] || "Analysis inconclusive";
        const treatment = text.match(/treatment:?\s*([^\n]+(\n[^\n]+)*?)(\n\n|\n[a-z]+:)/i)?.[1] || "Consult with a local agricultural extension officer";
        const prevention = text.match(/prevention:?\s*([^\n]+(\n[^\n]+)*?)(\n\n|\n[a-z]+:|$)/i)?.[1] || "Regular monitoring and proper farm hygiene";
        
        parsedResult = {
          disease: diseaseName,
          confidence: confidence,
          severity: severity,
          description: description,
          treatment: treatment,
          prevention: prevention
        };
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        
        // Fallback result
        parsedResult = {
          disease: "Analysis Inconclusive",
          confidence: 60,
          severity: "Medium",
          description: "The image analysis was inconclusive. The AI model couldn't clearly identify the issue.",
          treatment: "Consider taking a clearer photo or consulting with a local agricultural extension officer.",
          prevention: "Regular crop monitoring and maintaining farm hygiene practices."
        };
      }
      
      setAnalysisResult(parsedResult);
    } catch (error) {
      console.error("Error analyzing image with Gemini:", error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze the image. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "text-red-600 bg-red-100";
      case "Medium": return "text-orange-600 bg-orange-100";
      case "Low": return "text-yellow-600 bg-yellow-100";
      default: return "text-green-600 bg-green-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    return severity === "None" ? CheckCircle : AlertTriangle;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Disease Detection
          </CardTitle>
          <p className="text-blue-100 text-sm">
            Upload a photo of your crop to detect diseases
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Uploaded crop" 
                  className="max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-gray-600">Click to upload crop image</p>
                  <p className="text-sm text-gray-500">
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
              disabled={!selectedImage || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Image"}
            </Button>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Tips for best results:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Take clear, well-lit photos</li>
                <li>Focus on affected leaves or stems</li>
                <li>Include multiple angles if possible</li>
                <li>Avoid blurry or dark images</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {isAnalyzing ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing image...</p>
              <p className="text-sm text-gray-500 mt-2">
                Our AI is examining your crop for diseases and pests
              </p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getSeverityIcon(analysisResult.severity);
                  return <Icon className="w-6 h-6 text-green-600" />;
                })()}
                <div>
                  <h3 className="font-semibold text-lg">{analysisResult.disease}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(analysisResult.severity)}`}>
                      {analysisResult.severity} Risk
                    </span>
                    <span className="text-sm text-gray-600">
                      {analysisResult.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                  <p className="text-sm text-gray-700">{analysisResult.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Treatment</h4>
                  <p className="text-sm text-gray-700">{analysisResult.treatment}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Prevention</h4>
                  <p className="text-sm text-gray-700">{analysisResult.prevention}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Need help?</strong> Contact your local agricultural extension officer 
                  or visit the nearest agrovet for specific treatments.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Upload an image to get started</p>
              <p className="text-sm mt-1">
                Our AI will analyze your crop and provide treatment recommendations
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
