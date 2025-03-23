'use client';

import { useState, useEffect } from 'react';
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
  "Latest Supreme Court judgments on property law",
  "Recent amendments to Companies Act",
  "Interpretation of Section 302 IPC",
  "Key points of new IT Rules 2024",
  "Landmark cases on intellectual property",
  "Environmental law compliance requirements"
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-white">AI Legal Assistant</h1>
        <p className="text-green-100 mt-1">Professional legal research and analysis</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p className="text-lg">Welcome to your Professional Legal Assistant</p>
                <p className="mt-2">Ask any legal research question to get started</p>
              </div>
            )}
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white ml-12'
                      : 'bg-white text-black shadow-sm border border-gray-100 mr-12'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className={`text-xs mt-2 block ${
                    message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-black shadow-sm border border-gray-100 max-w-[70%] rounded-lg p-4">
                  <ThinkingAnimation />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your legal research query..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
                disabled={isLoading}
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel - Legal Queries */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Legal Research Queries</h2>
          <div className="space-y-3">
            {legalQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => setNewMessage(query)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-black transition-colors text-sm border border-gray-100 hover:border-green-200"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
