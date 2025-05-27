import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDEFsF9visXbuZfNEvtPvC8wI_deQBH-ro');

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Model configuration
  const MODEL_NAME = 'gemini-2.5-flash-preview-05-20';
  
  // Add initial greeting from the assistant
  useEffect(() => {
    setMessages([
      { 
        role: 'model', 
        content: 'Hello! I\'m your AgriSenti AI assistant. How can I help you with farming, weather, crops, or market information today?' 
      }
    ]);
  }, []);

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

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
    
    // Add user message
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Create conversation history
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      // Add current message
      history.push({
        role: 'user',
        parts: [{ text: inputValue }]
      });

      // Get the generative model
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      
      // Start chat with history
      const chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
      
      // Send message and get response
      const result = await chat.sendMessage(inputValue);
      const response = await result.response;
      const text = response.text();
      
      // Add model response
      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (error) {
      console.error('Error communicating with Gemini API:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          content: 'Sorry, I encountered an error. Please try again later.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full shadow-lg"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat modal */}
      {isOpen && (
        <div 
          className={`absolute ${isMobileView ? 'bottom-16 right-0 w-screen max-w-full' : 'bottom-16 right-0'} bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col`}
          style={{ width: isMobileView ? '100%' : '350px', height: '500px' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-green-600 text-white rounded-t-lg">
            <h2 className="text-lg font-semibold">AgriSenti AI Assistant</h2>
            <p className="text-xs opacity-75">Powered by Google Gemini</p>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
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
              <div className="flex justify-start mb-4">
                <div className="p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                  <Loader2 className="animate-spin h-5 w-5" />
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="resize-none flex-1"
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
              className="self-end"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
