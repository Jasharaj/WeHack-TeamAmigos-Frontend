'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MessageCircle, 
  Clock, 
  Brain, 
  Search,
  FileText,
  Scale,
  BookOpen,
  Lightbulb,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { getGeminiResponse } from '@/utils/gemini';
import { saveMessages, loadMessages } from '@/utils/chatStorage';
import ThinkingAnimation from '@/components/ThinkingAnimation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const legalQueries = [
  {
    title: "Supreme Court Judgments",
    query: "Latest Supreme Court judgments on property law",
    icon: Scale,
    category: "Case Law"
  },
  {
    title: "Companies Act Amendments",
    query: "Recent amendments to Companies Act",
    icon: FileText,
    category: "Corporate Law"
  },
  {
    title: "Criminal Law Analysis",
    query: "Interpretation of Section 302 IPC",
    icon: BookOpen,
    category: "Criminal Law"
  },
  {
    title: "IT Rules 2024",
    query: "Key points of new IT Rules 2024",
    icon: Brain,
    category: "Technology Law"
  },
  {
    title: "IP Landmark Cases",
    query: "Landmark cases on intellectual property",
    icon: Lightbulb,
    category: "IP Law"
  },
  {
    title: "Environmental Compliance",
    query: "Environmental law compliance requirements",
    icon: Search,
    category: "Environmental Law"
  }
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = loadMessages(true);
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages, true);
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(newMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your legal request. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuery = (query: string) => {
    setNewMessage(query);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('lawyerChatMessages');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gradient-to-br from-white via-emerald-50/30 to-white flex flex-col"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-b border-slate-200 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Legal Assistant</h1>
              <p className="text-slate-600">Professional legal research and analysis powered by AI</p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.length === 0 ? (
              /* Welcome Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Welcome to AI Legal Assistant</h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Ask me anything about legal research, case law analysis, or get professional legal insights.
                </p>

                {/* Legal Query Cards */}
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium text-slate-700">Try these legal queries:</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {legalQueries.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: "rgba(16, 185, 129, 0.05)"
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleQuickQuery(item.query)}
                          className="p-4 text-left bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition-all duration-200 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <IconComponent className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{item.title}</p>
                              <p className="text-xs text-slate-500">{item.category}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Chat Messages */
              messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex gap-3 max-w-3xl ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-slate-600 to-slate-700' 
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}>
                      <div className={`px-6 py-4 rounded-2xl shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                          : 'bg-white border border-slate-200'
                      }`}>
                        <p className={`text-sm leading-relaxed ${
                          message.role === 'user' ? 'text-white' : 'text-slate-800'
                        }`}>
                          {message.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Loading Animation */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
                  <ThinkingAnimation />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-t border-slate-200 bg-white p-6"
        >
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me anything about legal research, case law, or legal procedures..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200 pr-12"
                disabled={isLoading}
              />
              {newMessage && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNewMessage('')}
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!newMessage.trim() || isLoading}
              className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                !newMessage.trim() || isLoading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>

          <p className="text-xs text-slate-500 mt-3 text-center">
            AI responses are for research purposes only and should not replace professional legal advice.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
