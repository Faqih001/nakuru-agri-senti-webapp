import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FormattedMessage } from './FormattedMessage';
import { createStructuredPrompt } from '@/lib/chatFormat';

// Constants
const MODEL_NAME = 'gemini-1.5-flash';  // Using stable model
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

interface Message {
  role: 'user' | 'model' | 'error';
  content: string;
  timestamp: number;
}

export const AIChatbot: React.FC = () => {
  // State
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('agrisenti-chat-history');
    return savedMessages ? JSON.parse(savedMessages) : [{
      role: 'model',
      content: `**Hello! I'm your AgriSenti AI Assistant** 🌾

I'm here to help you with:

• **Farming Advice** - Crop management and best practices
• **Weather Information** - Current conditions and forecasts  
• **Crop Guidance** - Planting, fertilizing, and harvesting
• **Market Insights** - Prices and selling opportunities
• **Pest Management** - Identification and control methods

**How can I assist you with your farming needs today?**`,
      timestamp: Date.now()
    }];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrisenti-chat-history', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  // Detect mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  // Handle unread messages
  useEffect(() => {
    if (
      messages.length > 0 &&
      !isOpen &&
      messages[messages.length - 1].role === 'model'
    ) {
      setHasUnreadMessages(true);
    } else if (isOpen) {
      setHasUnreadMessages(false);
    }
  }, [messages, isOpen]);

  // Helper function to optimize prompt based on device size
  const getOptimizedPrompt = (input: string): string => {
    return createStructuredPrompt(input, isMobileView);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (!genAI) {
      const errorMessage: Message = {
        role: 'error',
        content: 'API Configuration Error: Gemini API key is not configured. Please check your environment variables.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

    try {
      // Show loading after 1 second if still processing
      loadingTimeout = setTimeout(() => {
        if (isLoading) {
          const tempMessage: Message = {
            role: 'model',
            content: 'Processing your request...',
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, tempMessage]);
        }
      }, 1000);

      // Get recent context but limit to last 10 messages
      const recentMessages = [...messages.slice(-10), userMessage];
      const parts = [getOptimizedPrompt(userMessage.content)];
      
      console.log("Sending prompt to Gemini:", parts[0]); // For debugging
      
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent(parts);
      const response = result.response;
      const responseText = response.text();
      
      console.log("Gemini response:", responseText); // For debugging

      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Empty response from Gemini API");
      }

      // Add model response
      const assistantMessage: Message = {
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      let errorContent = 'I apologize, but I encountered an error processing your request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes("API_KEY")) {
          errorContent = 'Invalid API key. Please check your Gemini API configuration.';
        } else if (error.message.includes("quota")) {
          errorContent = 'API quota exceeded. Please try again later.';
        } else if (error.message.includes("network")) {
          errorContent = 'Network error. Please check your internet connection.';
        }
      }
      
      const errorMessage: Message = {
        role: 'error',
        content: errorContent,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      } else if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        
        if (!isOpen) {
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.focus();
            }
          }, 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <div 
      ref={modalRef}
      className="fixed bottom-0 right-0 z-50 p-4 w-full md:w-auto"
      role="dialog"
      aria-label="AI Chat Assistant"
    >
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 flex flex-col
            ${isMobileView ? 
              'mx-auto w-[calc(100%-2rem)] h-[80vh] max-h-[600px] mb-20' : 
              'w-[400px] md:w-[450px] lg:w-[500px] h-[600px] mb-20'
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.6 13.4A7 7 0 1 1 15 8a7 7 0 0 1-1.4 5.4m0 0l3.71 3.71a1 1 0 1 1-1.42 1.42L12.2 15a7 7 0 0 1-4.2 1c-1.56 0-3-.41-4.2-1l-3.71 3.71a1 1 0 0 1-1.42-1.42L2.4 13.4A7 7 0 0 1 1 8c0-1.56.41-3 1.4-4.2M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold">AgriSenti Assistant</h2>
                <p className="text-xs text-gray-500">AI-powered farming insights</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scroll-area bg-gradient-to-b from-white/50 to-white/30 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div
                key={`${message.timestamp}-${index}`}
                className={`flex items-start space-x-2 ${message.role === 'user' ? 'justify-end space-x-reverse' : 'justify-start'}`}
              >
                {message.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.6 13.4A7 7 0 1 1 15 8a7 7 0 0 1-1.4 5.4m0 0l3.71 3.71a1 1 0 1 1-1.42 1.42L12.2 15a7 7 0 0 1-4.2 1c-1.56 0-3-.41-4.2-1l-3.71 3.71a1 1 0 0 1-1.42-1.42L2.4 13.4A7 7 0 0 1 1 8c0-1.56.41-3 1.4-4.2M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-green-500 text-white ml-4'
                      : message.role === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'bg-white border border-gray-100'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap text-[15px]">{message.content}</p>
                  ) : (
                    <FormattedMessage 
                      content={message.content} 
                      className="text-[15px] text-gray-800"
                    />
                  )}
                  <span className={`text-[11px] mt-1 block ${
                    message.role === 'user' 
                      ? 'text-white/75'
                      : message.role === 'error'
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm rounded-b-2xl">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about farming, weather, or crops..."
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-white/80 p-3 pr-12 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-[15px] placeholder:text-gray-400 min-h-[44px]"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || !genAI}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-green-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 w-14 h-14 bg-green-500 text-white rounded-full shadow-xl hover:bg-green-600 transition-all transform hover:scale-105 ${
          hasUnreadMessages ? 'animate-bounce' : ''
        } flex items-center justify-center`}
        aria-label="Open chat"
      >
        {hasUnreadMessages ? (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        ) : null}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.6 13.4A7 7 0 1 1 15 8a7 7 0 0 1-1.4 5.4m0 0l3.71 3.71a1 1 0 1 1-1.42 1.42L12.2 15a7 7 0 0 1-4.2 1c-1.56 0-3-.41-4.2-1l-3.71 3.71a1 1 0 0 1-1.42-1.42L2.4 13.4A7 7 0 0 1 1 8c0-1.56.41-3 1.4-4.2M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
        </svg>
      </button>
    </div>
  );
};

export default AIChatbot;
