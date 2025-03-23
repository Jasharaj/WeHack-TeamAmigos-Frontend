'use client';

import React, { useState } from 'react';
import { getGeminiResponse } from '@/utils/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AssistantChatProps {
  userType: 'lawyer' | 'citizen';
}

const AssistantChat: React.FC<AssistantChatProps> = ({ userType }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Create a context-aware prompt based on user type
      const contextPrompt = userType === 'lawyer'
        ? `As a legal professional assistant, help with the following query: ${userMessage}`
        : `As a legal assistant helping a citizen, explain in simple terms: ${userMessage}`;

      const response = await getGeminiResponse(contextPrompt);
      
      // Add assistant's response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-t-xl shadow-lg p-4">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          {userType === 'lawyer' ? 'Legal Professional Assistant' : 'Legal Assistant'}
        </h2>
        <p className="text-gray-600">
          {userType === 'lawyer'
            ? 'Get professional legal insights and research assistance'
            : 'Get help understanding legal matters in simple terms'}
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-black shadow-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-black rounded-lg p-4 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-lg p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your legal question..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssistantChat;
