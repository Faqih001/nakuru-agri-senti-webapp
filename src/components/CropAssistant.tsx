import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Image, Mic, Paperclip, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  thinking?: boolean;
}

export const CropAssistant = () => {
  // Initialize Gemini API
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDEFsF9visXbuZfNEvtPvC8wI_deQBH-ro";
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Habari! I'm your AgriSenti assistant. I can help you with crop management, planting schedules, fertilizer recommendations, and more. What would you like to know about farming in Nakuru?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Add immediate "thinking" indicator message
    const thinkingMessage: Message = {
      id: `thinking-${Date.now().toString()}`,
      text: "Thinking...",
      sender: "bot",
      timestamp: new Date(),
      thinking: true
    };
    
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      // Get response from Gemini API
      const response = await generateGeminiResponse(inputValue);
      
      // Remove the thinking message and add the actual response
      setMessages(prev => prev.filter(m => !m.thinking));
      
      const botMessage: Message = {
        id: (Date.now() + 100).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Remove thinking message and show error
      setMessages(prev => prev.filter(m => !m.thinking));
      
      const errorMessage: Message = {
        id: (Date.now() + 100).toString(),
        text: "Sorry, I'm having trouble generating a response. Please try again later.",
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateGeminiResponse = async (question: string): Promise<string> => {
    try {
      // Get the generative model (upgraded to Gemini-2.0-flash)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Create the prompt with context about farming in Nakuru, Kenya
      const prompt = `
      Act as an agricultural assistant for farmers in Nakuru County, Kenya. 
      You are an expert in African agriculture, specifically for the Nakuru region.
      Provide helpful, accurate advice about:
      - Local crops (maize, beans, potatoes, vegetables, etc.)
      - Farming practices suitable for Nakuru's climate and soil
      - Pest and disease management relevant to this region
      - Fertilizer recommendations appropriate for local soil conditions
      - Weather patterns and planting schedules for Nakuru
      
      User question: ${question}
      
      Keep your answers practical, specific to Nakuru County, and suitable for smallholder farmers. 
      Respond in a helpful, concise manner with actionable advice.
      `;
      
      // Generate content using Gemini API
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Failed to generate response from Gemini API");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What fertilizer should I use?",
    "How to control pests?",
    "When should I plant?",
    "Weather forecast for Nakuru"
  ];
  
  return (
    <div className="h-full flex flex-col min-h-[calc(100vh-8rem)]">
      <Card className="flex-1 flex flex-col overflow-hidden border shadow-md">
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 overflow-y-auto p-2 sm:p-4">
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex items-start gap-1.5 sm:gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="bg-green-600 p-1 sm:p-1.5 md:p-2 rounded-full flex-shrink-0">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] p-2 sm:p-3 rounded-lg break-words ${
                      message.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.sender === "user" && (
                    <div className="bg-gray-600 p-1 sm:p-1.5 md:p-2 rounded-full flex-shrink-0">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <div className="bg-green-600 p-1 sm:p-1.5 md:p-2 rounded-full flex-shrink-0">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce animate-delay-100"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce animate-delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-2 sm:p-3 md:p-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto whitespace-nowrap flex-shrink-0"
                >
                  {isMobile && question.length > 15 ? question.substring(0, 15) + "..." : question}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isMobile ? "Ask about farming..." : "Ask about crops, weather, fertilizers..."}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="text-sm flex-1 min-w-0"
                ref={inputRef}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputValue.trim()}
                className="bg-green-600 hover:bg-green-700 flex-shrink-0 px-2 sm:px-3 md:px-4"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
