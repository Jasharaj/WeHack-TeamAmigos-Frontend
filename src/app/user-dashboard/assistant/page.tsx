'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const mockChatHistory: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'How do I file an RTI application?',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    role: 'assistant',
    content: `Here's how to file an RTI application:

1. Write your application in simple language
2. Address it to the Public Information Officer (PIO)
3. Include your contact details
4. Pay the required fee (₹10 for general category)
5. Submit in person or by post

You can also file online through rtionline.gov.in`,
    timestamp: '10:31 AM'
  }
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(mockChatHistory);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand your question. Let me help you with that...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // Handle file upload and summarization
      console.log('Uploading file:', selectedFile.name);
      setSelectedFile(null);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex h-full">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white p-6 rounded-t-xl shadow-sm">
            <h1 className="text-2xl font-bold text-black">AI Legal Assistant</h1>
            <p className="text-black mt-1">Get instant answers to your legal questions</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-black shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-green-100' : 'text-black'
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 rounded-b-xl shadow-sm">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white p-6 border-l border-gray-200">
          <div className="space-y-6">
            {/* File Upload Section */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Document Analysis</h3>
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full"
                />
                {selectedFile && (
                  <div>
                    <p className="text-sm text-black mb-2">Selected: {selectedFile.name}</p>
                    <button
                      onClick={handleFileUpload}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Analyze Document
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Questions */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Quick Questions</h3>
              <div className="space-y-2">
                {[
                  'How to file RTI?',
                  'What are tenant rights?',
                  'Consumer protection laws',
                  'Property registration process'
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => setNewMessage(question)}
                    className="w-full text-left p-2 text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
