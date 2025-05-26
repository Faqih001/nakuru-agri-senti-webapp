import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const CropAssistant = () => {
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

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("maize") || input.includes("corn")) {
      return "For maize in Nakuru: Plant during long rains (March-May). Use DAP fertilizer at planting (50kg/acre) and top-dress with CAN after 6 weeks. Watch for fall armyworm - inspect weekly. Current market price: KSh 35-40/kg in Nakuru town.";
    }
    
    if (input.includes("beans")) {
      return "Beans grow well in Nakuru's climate. Plant at start of rains. Space rows 30cm apart. No nitrogen fertilizer needed - beans fix their own! Watch for bean fly and aphids. Harvest when pods are dry. Current price: KSh 80-120/kg.";
    }
    
    if (input.includes("potato")) {
      return "Potatoes are perfect for Nakuru highlands! Plant certified seeds during cool season. Hill soil around plants as they grow. Apply manure and NPK fertilizer. Harvest after 3-4 months when leaves turn yellow. Good market demand - KSh 40-60/kg.";
    }
    
    if (input.includes("weather") || input.includes("rain")) {
      return "Current weather in Nakuru: Expect short rains October-December. Long rains March-May. Use this time for land preparation. Check Kenya Met Department for weekly forecasts. Consider drought-resistant varieties if rains are uncertain.";
    }
    
    if (input.includes("fertilizer")) {
      return "For Nakuru soils: Test your soil pH first. Most crops need DAP at planting, CAN for top-dressing. Organic options: well-rotted manure, compost. Visit nearest agrovets in Nakuru town for quality fertilizers. Apply during rainy season for best results.";
    }
    
    return "I can help with crop advice for Nakuru farmers. Ask me about maize, beans, potatoes, weather, fertilizers, pest control, or market prices. For specific advice, tell me your crop type and current growth stage.";
  };

  const quickQuestions = [
    "When should I plant maize?",
    "Best fertilizer for beans?",
    "Potato disease prevention",
    "Current market prices"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="h-[calc(100vh-200px)] sm:h-[600px] flex flex-col bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-green-600 text-white p-3 sm:p-6 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Smart Crop Assistant</span>
          </CardTitle>
          <p className="text-green-100 text-xs sm:text-sm">
            Get personalized farming advice for Nakuru County
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 p-2 sm:p-4 overflow-hidden">
            <div className="space-y-3 sm:space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="bg-green-600 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg break-words ${
                      message.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.sender === "user" && (
                    <div className="bg-gray-600 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-green-600 p-1.5 sm:p-2 rounded-full flex-shrink-0">
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
          
          <div className="p-2 sm:p-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto whitespace-nowrap"
                >
                  {question}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about crops, weather, fertilizers..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="text-sm flex-1 min-w-0"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputValue.trim()}
                className="bg-green-600 hover:bg-green-700 flex-shrink-0 px-3 sm:px-4"
                size="sm"
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
