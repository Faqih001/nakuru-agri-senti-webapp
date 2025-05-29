# Google Gemini API Integration Guide

This guide explains how to use the Google Gemini API in the AgriSenti Web Application.

## API Key

The Gemini API key is stored in the environment variable `VITE_GEMINI_API_KEY`. The default key is provided in the code for development purposes, but for production deployments, you should use your own API key.

## Integration Components

The following components use the Gemini AI API:

1. **CropAssistant** (`/src/components/CropAssistant.tsx`) - Uses Gemini 2.0 Flash for intelligent farming advice
2. **DiseaseDetection** (`/src/components/DiseaseDetection.tsx`) - Uses Gemini 2.0 Flash for plant disease detection
3. **WeatherDashboard** (`/src/pages/WeatherDashboard.tsx`) - Uses Gemini 2.0 Flash for weather-based farming insights
4. **AIChatbot** (`/src/components/AIChatbot.tsx`) - Uses Gemini 2.5 Flash Preview for the general AI chatbot

## How to Use Gemini API

### Basic Usage

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDEFsF9visXbuZfNEvtPvC8wI_deQBH-ro";
const genAI = new GoogleGenerativeAI(API_KEY);

// Create a function to use the Gemini API
const generateContent = async (prompt: string): Promise<string> => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
```

### Using with Images (Vision API)

```typescript
// For components that need to analyze images
const analyzeImage = async (imageBase64: string, prompt: string): Promise<string> => {
  // Get the model with vision capability
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  // Prepare the image part
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: "image/jpeg",
    },
  };
  
  // Generate content with text and image
  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  return response.text();
};
```

### Best Practices

1. **Use React's `useMemo` hook** to prevent recreating the Gemini client on each render:

   ```typescript
   const genAI = useMemo(() => new GoogleGenerativeAI(API_KEY), [API_KEY]);
   ```

2. **Add proper error handling** to manage API failures gracefully.

3. **Craft effective prompts** that provide context relevant to farming in Nakuru, Kenya.

4. **Use the right model** for each task:
   - Text: `gemini-2.0-flash`
   - Images: `gemini-2.0-flash`
   - Advanced chatbot: `gemini-2.5-flash-preview-05-20`

## Resources

- [Google AI Studio](https://ai.google.dev/studio) - To test prompts
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Node.js SDK Reference](https://github.com/google/generative-ai-js)
