import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

// Initialize Gemini AI with API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState<number>(40);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Model configuration
  const MODEL_NAME = 'gemini-pro';
  
  // Load chat history from localStorage or show initial greeting
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('agrisenti-chat-history');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    
    // If no history or error, set initial greeting
    setMessages([
      { 
        role: 'model', 
        content: 'Hello! I\'m your AgriSenti AI assistant. How can I help you with farming, weather, crops, or market information today?' 
      }
    ]);
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('agrisenti-chat-history', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages]);

  // Enhanced responsive design: track screen size categories
  useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      const isMobile = width < 768; // Use 768px as the breakpoint for mobile devices
      setIsMobileView(isMobile);
      
      // Reset textarea height when window is resized
      if (textareaRef.current) {
        textareaRef.current.style.height = isMobile ? '36px' : '40px';
      }
    };
    
    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);
    
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  // Listen for orientation changes on mobile devices
  useEffect(() => {
    const handleOrientationChange = () => {
      // Adjust for orientation change by rechecking device size
      const width = window.innerWidth;
      setIsMobileView(width < 768);
      
      // Reset textarea height when orientation changes
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        setTextareaHeight(isMobileView ? 36 : 40);
      }
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobileView]);

  // Scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    // Store the current input value before clearing it
    const currentInput = inputValue;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      
      // Create system prompt for context
      const systemPrompt = {
        role: 'system',
        content: `You are AgriSentiBot, an AI assistant for AgriSenti, an agriculture platform focused on helping farmers in Kenya, especially around Nakuru.
        You provide information about:
        1. Farming practices suitable for the Nakuru region
        2. Weather forecasts and climate-smart farming
        3. Crop diseases identification and prevention
        4. Market prices and agricultural economics
        5. Sustainable agriculture techniques
        
        Be friendly, helpful, and provide practical advice that farmers in Kenya can implement.
        Current date: ${new Date().toLocaleDateString()}`
      };
      
      // Gather conversation history, limited to last 10 messages to avoid token limits
      const recentMessages = [...messages.slice(-10), userMessage];
      
      // Create content parts for the model
      const parts = [
        { text: systemPrompt.content },
        ...recentMessages.map(msg => ({ text: `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}` })),
        { text: `User: ${currentInput}\nAssistant:` }
      ];
      
      // Send message and get response
      const result = await model.generateContent(parts);
      const response = await result.response;
      const text = response.text();
      
      // Add model response
      const assistantMessage = { role: 'model' as const, content: text };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error communicating with Gemini API:', error);
      const errorMessage = { 
        role: 'model' as const, 
        content: 'Sorry, I encountered an error. Please try again later.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-50">
      {/* Chatbot toggle button - enhanced for different device sizes */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full shadow-lg bg-green-600 hover:bg-green-700 transition-all duration-200"
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
      >
        {isOpen ? <X size={20} className="md:h-6 md:w-6 lg:h-7 lg:w-7" /> : <MessageSquare size={20} className="md:h-6 md:w-6 lg:h-7 lg:w-7" />}
      </Button>

      {/* Chat modal - enhanced responsive design */}
      {isOpen && (
        <div 
          className={`absolute bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col chatbot-modal
            ${isMobileView ? 
              'bottom-16 right-0 left-0 mx-2 max-h-[80vh]' : 
              'bottom-16 right-0 w-[350px] md:w-[400px] lg:w-[450px] h-[500px] max-h-[80vh]'}`}
        >
          {/* Header - enhanced responsiveness */}
          <div className="p-3 md:p-4 border-b border-gray-200 bg-green-600 text-white rounded-t-lg flex justify-between items-center">
            <div>
              <h2 className="text-base md:text-lg font-semibold">AgriSenti AI Assistant</h2>
              <p className="text-[10px] md:text-xs opacity-75">Powered by Google Gemini</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-green-700 p-1 md:p-2 text-xs md:text-sm"
              onClick={() => {
                localStorage.removeItem('agrisenti-chat-history');
                setMessages([{ 
                  role: 'model', 
                  content: 'History cleared. How can I help you today?' 
                }]);
              }}
            >
              Clear
            </Button>
          </div>

          {/* Messages - enhanced for better readability on all devices */}
          <ScrollArea className="flex-1 p-2 md:p-4">
            <div ref={scrollAreaRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 md:mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-2 md:p-3 rounded-lg max-w-[85%] md:max-w-[80%] text-sm md:text-base ${
                      message.role === 'user'
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-3 md:mb-4">
                  <div className="p-2 md:p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                    <Loader2 className="animate-spin h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input area - enhanced for better mobile interaction */}
          <form onSubmit={handleSendMessage} className="p-2 md:p-3 lg:p-4 border-t border-gray-200 flex gap-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // Auto-resize the textarea
                const scrollHeight = Math.min(e.target.scrollHeight, isMobileView ? 100 : 120);
                setTextareaHeight(scrollHeight);
                e.target.style.height = 'auto';
                e.target.style.height = `${scrollHeight}px`;
              }}
              placeholder="Type your message..."
              className="resize-none flex-1 text-sm md:text-base min-h-[36px] md:min-h-[40px] max-h-[100px] md:max-h-[150px] px-3 py-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || isLoading}
              className="self-end h-9 w-9 md:h-10 md:w-10 p-0"
              aria-label="Send message"
            >
              <Send size={16} className="md:h-5 md:w-5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
