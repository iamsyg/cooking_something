// app/(app)/chatbox/page.tsx
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Paperclip, Phone, Send, User, Bot } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I assist you today?', sender: 'agent', timestamp: new Date(Date.now() - 3600000), type: 'text' },
    { id: '2', text: 'Hi, I need help with my account settings.', sender: 'user', timestamp: new Date(Date.now() - 1800000), type: 'text' },
    { id: '3', text: 'Sure, I can help with that. What specific setting are you having trouble with?', sender: 'agent', timestamp: new Date(Date.now() - 900000), type: 'text' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Simulate agent response
    setTimeout(() => {
      const responses = [
        "I understand. Let me check that for you.",
        "Thanks for sharing that information.",
        "I'll help you resolve this issue.",
        "Could you provide more details about your concern?",
        "I'm looking into your request now."
      ];
      
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'agent',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: '',
        sender: 'user',
        timestamp: new Date(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileUrl: reader.result as string,
        fileName: file.name
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(true);
      
      // Simulate agent response
      setTimeout(() => {
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: file.type.startsWith('image/') 
            ? 'Thanks for sharing the image. I can see it clearly.' 
            : `I've received your document: ${file.name}. I'll review it shortly.`,
          sender: 'agent',
          timestamp: new Date(),
          type: 'text'
        };
        
        setMessages(prev => [...prev, agentResponse]);
        setIsLoading(false);
      }, 1500);
    };
    
    reader.readAsDataURL(file);
    setShowAttachmentMenu(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCallClick = () => {
    // In a real app, this would initiate a call
    alert('Initiating call with agent...');
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-gray-900">Agent Support</h1>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-900">Online</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleCallClick}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>Call Agent</span>
        </button>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}
            >
              {/* Message Header */}
              <div className="flex items-center space-x-2 mb-1">
                <div className={`p-1 rounded-full ${message.sender === 'agent' ? 'bg-blue-100' : 'bg-blue-200'}`}>
                  {message.sender === 'agent' ? (
                    <Bot className="w-3 h-3 text-blue-600" />
                  ) : (
                    <User className="w-3 h-3 text-blue-600" />
                  )}
                </div>
                <span className="text-xs font-medium">
                  {message.sender === 'agent' ? 'Agent' : 'You'}
                </span>
                <span className="text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              
              {/* Message Content */}
              {message.type === 'text' ? (
                <p className="text-sm">{message.text}</p>
              ) : message.type === 'image' ? (
                <div className="mt-2">
                  <img 
                    src={message.fileUrl} 
                    alt={message.fileName || 'Uploaded image'} 
                    className="rounded-lg max-w-full max-h-64 object-cover"
                  />
                  <p className="text-xs mt-1 opacity-80">{message.fileName}</p>
                </div>
              ) : (
                <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                  <Paperclip className="w-4 h-4" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{message.fileName}</p>
                    <p className="text-xs text-gray-900">Document</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator for agent response */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-full bg-blue-100">
                  <Bot className="w-3 h-3 text-blue-600" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="relative">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            {/* Attachment Button and Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Paperclip className="w-5 h-5 text-gray-900" />
              </button>
              
              {showAttachmentMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-900">Image/Video</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-900">Document</span>
                  </label>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
            />
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className={`p-3 rounded-full transition-colors ${inputMessage.trim() && !isLoading
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-900 cursor-not-allowed'}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">
            Agent typically replies within 2 minutes
          </p>
        </div>
      </div>
    </div>
  );
}