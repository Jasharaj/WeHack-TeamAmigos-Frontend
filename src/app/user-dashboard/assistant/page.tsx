'use client';

import { useState, useEffect } from 'react';
import { getGeminiResponse } from '@/utils/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const mockChatHistory: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Welcome to CasePilot! I\'m your legal assistant, ready to help you understand your rights and legal options. Feel free to ask any questions about legal procedures, rights, or general legal advice.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export default function UserAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('userChatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(mockChatHistory);
      localStorage.setItem('userChatHistory', JSON.stringify(mockChatHistory));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('userChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessageObj: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessageObj]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(newMessage, 'citizen');
      const assistantMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessageObj]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Legal Assistant</h1>
        <p className="text-gray-600">Get help understanding your legal rights and options</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm p-6 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 min-h-[400px] mb-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  No messages yet. Start by asking a legal question!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.role === 'assistant'
                        ? 'bg-gray-100 text-black'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs mt-2 opacity-70 block">{message.timestamp}</span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 max-w-[70%]">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask any legal question in simple terms..."
              className="flex-1 rounded-lg border border-gray-300 p-3 focus:outline-none focus:border-green-500 text-black placeholder-black/70"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </form>
        </div>

        {/* Example Queries */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Common Questions</h2>
          <div className="space-y-2">
            {[
              'How do I file a consumer complaint?',
              'What are my rights as a tenant?',
              'Steps to file an FIR',
              'How to apply for legal aid?',
              'Marriage registration process',
              'Rights during police questioning'
            ].map((query) => (
              <button
                key={query}
                onClick={() => setNewMessage(query)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-black transition-colors border border-gray-100 hover:border-gray-200"
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
