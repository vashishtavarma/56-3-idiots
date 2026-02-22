import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, RotateCcw, BookOpen } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Knowledge mode: changes config only; still uses Nova Lite
  const [useKnowledge, setUseKnowledge] = useState(false);
  const getInitialMessages = () => [
    {
      id: 1,
      text: "Hello! I'm your EduTube AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ];

  const [messages, setMessages] = useState(getInitialMessages());
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message to chatbot API:', messageToSend);
      
      const response = await fetch('http://65.1.133.54:5000/api/v1/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          context: "EduTube learning platform",
          use_knowledge: useKnowledge
        })
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        const msg = data.detail || data.error || 'Failed to get response from AI';
        throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      }
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.response || "Sorry, I couldn't process your request. Please try again.",
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: error.message.includes('Failed to fetch') 
          ? "Connection error. Please check if the server is running and try again." 
          : `Error: ${error.message}`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages(getInitialMessages());
    setInputMessage('');
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  return (
    <>
      {/* Chat Button - Bottom Right */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-0"
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}

      {/* Chat Window - Made larger; opaque background for light/dark theme */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-96 h-[32rem] bg-card rounded-lg shadow-2xl border border-border flex flex-col overflow-hidden text-card-foreground"
          style={{ backgroundColor: 'var(--card)' }}
        >
          {/* Chat Header – EduChat with circular logo */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 border border-primary-foreground/30"
                aria-hidden
              >
                <span className="text-primary-foreground font-bold text-sm">EC</span>
              </div>
              <div>
                <h3 className="font-semibold">EduChat</h3>
                {useKnowledge && (
                  <span className="text-xs opacity-90 flex items-center gap-0.5">
                    <BookOpen size={12} /> Knowledge
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setUseKnowledge((k) => !k)}
                className={`hover:bg-primary-foreground/10 p-1.5 rounded focus:outline-none ${useKnowledge ? 'bg-primary-foreground/20' : ''}`}
                aria-label="Toggle knowledge mode"
                title={useKnowledge ? 'Knowledge mode ON' : 'Knowledge mode OFF'}
              >
                <BookOpen size={16} />
              </button>
              <button
                onClick={resetChat}
                className="hover:bg-primary-foreground/10 p-1.5 rounded focus:outline-none"
                aria-label="Reset chat"
                title="Start fresh conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-foreground/10 p-1.5 rounded focus:outline-none"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-background"
            style={{ backgroundColor: 'var(--background)' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-card text-card-foreground border border-border'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isBot ? 'text-muted-foreground' : 'text-primary-foreground/80'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="p-4 bg-card border-t border-border"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none border-2 border-gray-600 dark:border-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-0 bg-background text-foreground placeholder:text-muted-foreground"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-lg p-2 focus:outline-none focus:ring-0 transition-colors"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;