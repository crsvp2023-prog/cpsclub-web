'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to CPS Club. I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses: { [key: string]: string } = {
    'hello': 'Hi there! 👋 How can I assist you with CPS Club?',
    'hi': 'Hello! 😊 What would you like to know about CPS Club?',
    'about': 'CPS Club is a vibrant community of cricket enthusiasts dedicated to promoting wellness and community engagement through cricket. We organize tournaments and community events!',
    'events': 'We have amazing cricket tournaments and coaching sessions! Check out our Events page to see all upcoming activities and tournaments.',
    'contact': 'You can reach us at crsvp.2023@gmail.com or visit our Contact page for more information. We respond within 24 hours!',
    'tournament': 'We\'ve organized 2 successful cricket tournaments! You can view highlights and photos in our About page.',
    'scores': 'Want to check live cricket scores? Visit our Scores page to see the latest match updates and standings!',
    'join': 'We\'d love to have you join CPS Club! Visit our Contact page to get in touch with us, or check out our Events page.',
    'donation': 'We proudly contributed AUD 8,000+ to COVID-19 relief. You can view our donation certificate on the About page!',
    'gallery': 'Check out our Gallery page to see photos from our tournaments and community events!',
    'coach': 'We offer senior cricket coaching sessions every Saturday at Chatswood Premier Sports Club from 9AM - 11AM. Visit Events for details!',
    'default': 'That\'s a great question! You can visit our website pages (Home, About, Gallery, Events, Scores, Contact) to find more information, or feel free to ask me anything else!'
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        console.error('API Error Status:', response.status);
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.message || 'Sorry, I could not process that. Please try again.';
    } catch (error) {
      console.error('Chat API Error:', error);
      // Fallback to keyword responses if API fails
      return getFallbackResponse(userMessage);
    }
  };

  const fallbackResponses: { [key: string]: string } = {
    'hello': 'Hi there! 👋 How can I assist you with CPS Club?',
    'hi': 'Hello! 😊 What would you like to know about CPS Club?',
    'about': 'CPS Club is a vibrant community of cricket enthusiasts dedicated to promoting wellness and community engagement through cricket. We organize tournaments and community events!',
    'events': 'We have amazing cricket tournaments and coaching sessions! Check out our Events page to see all upcoming activities and tournaments.',
    'contact': 'You can reach us at crsvp.2023@gmail.com or visit our Contact page for more information. We respond within 24 hours!',
    'tournament': 'We\'ve organized 2 successful cricket tournaments! You can view highlights and photos in our About page.',
    'scores': 'Want to check live cricket scores? Visit our Scores page to see the latest match updates and standings!',
    'join': 'We\'d love to have you join CPS Club! Visit our Contact page to get in touch with us, or check out our Events page.',
    'donation': 'We proudly contributed AUD 8,000+ to COVID-19 relief. You can view our donation certificate on the About page!',
    'gallery': 'Check out our Gallery page to see photos from our tournaments and community events!',
    'coach': 'We offer senior cricket coaching sessions every Saturday at Chatswood Premier Sports Club from 9AM - 11AM. Visit Events for details!',
  };

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return 'That\'s a great question! Feel free to check our website pages (Home, About, Gallery, Events, Scores, Contact) for more information!';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110"
        title="Open Chat"
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-40 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-6 text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏏</span>
              <div>
                <h3 className="text-xl font-bold">CPS Club Assistant</h3>
                <p className="text-sm text-white/80">We're here to help!</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-full p-3 hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <span className="text-lg">{isLoading ? '⏳' : '➤'}</span>
              </button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-600 font-semibold mb-2">Quick Links:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setInputValue('Tell me about events');
                  handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="text-xs bg-white text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full px-3 py-2 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                Events
              </button>
              <button
                onClick={() => {
                  setInputValue('How to contact');
                  handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="text-xs bg-white text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full px-3 py-2 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                Contact
              </button>
              <button
                onClick={() => {
                  setInputValue('Tell me about');
                  handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="text-xs bg-white text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full px-3 py-2 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  setInputValue('How to join');
                  handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="text-xs bg-white text-[var(--color-primary)] border border-[var(--color-primary)] rounded-full px-3 py-2 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
