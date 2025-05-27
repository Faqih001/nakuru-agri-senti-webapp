import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Constants
const MODEL_NAME = 'gemini-pro';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

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
      content: 'Hello! I\'m your AgriSenti AI assistant. How can I help you with farming, weather, crops, or market information today?',
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
    const basePrompt = `You are an AI assistant for AgriSenti, specializing in agricultural topics.
    Focus on providing practical farming advice, weather insights, crop information, and market data.
    Current date: ${new Date().toLocaleDateString()}`;
    
    if (isMobileView) {
      return `${basePrompt}
      IMPORTANT: User is on mobile - keep responses concise.
      Limit response to 150-200 words maximum. User query: ${input}`;
    }
    
    return `${basePrompt}
    User query: ${input}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    let loadingTimeout: ReturnType<typeof setTimeout>;

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
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent(parts);
      const response = result.response;

      // Add model response
      const assistantMessage: Message = {
        role: 'model',
        content: response.text(),
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        role: 'error',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      clearTimeout(loadingTimeout);
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
      className={`fixed bottom-0 right-0 z-50 flex flex-col p-4 ${
        isOpen ? 'h-full md:h-auto' : 'h-auto'
      }`}
      role="dialog"
      aria-label="AI Chat Assistant"
    >
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col chatbot-modal
            ${isMobileView ? 
              'bottom-16 right-0 left-0 mx-2 max-h-[80vh]' : 
              'bottom-16 right-0 w-[350px] md:w-[400px] lg:w-[450px] h-[500px] max-h-[80vh]'
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">AgriSenti Assistant</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-area">
            {messages.map((message, index) => (
              <div
                key={`${message.timestamp}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.role === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
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
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex items-end space-x-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
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
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors ${
          hasUnreadMessages ? 'animate-bounce' : ''
        }`}
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default AIChatbot;
