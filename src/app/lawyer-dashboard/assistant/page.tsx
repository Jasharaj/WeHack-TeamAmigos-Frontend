'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const mockConversation: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Can you summarize IPC Section 420?',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    role: 'assistant',
    content: 'IPC Section 420 deals with cheating and dishonestly inducing delivery of property. Key points:\n\n1. Punishment: Up to 7 years imprisonment\n2. Fine: Amount not specified\n3. Elements: Deception, fraudulent intention, wrongful gain\n4. Cognizable and non-bailable offense',
    timestamp: '10:31 AM'
  }
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(mockConversation);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
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
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand your query. Let me analyze that for you...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">AI Legal Assistant</h1>
        <p className="text-black mt-1">Get instant answers to your legal queries</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className={`text-xs mt-2 block ${
                    message.role === 'user' ? 'text-green-100' : 'text-black'
                  }`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask your legal question..."
                className="flex-1 rounded-lg form-input"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Upload Document</h2>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isUploading ? 'border-green-300 bg-green-50' : 'border-gray-300'
              }`}
            >
              {isUploading ? (
                <div className="text-green-600">
                  <p className="font-medium">Uploading...</p>
                  <p className="text-sm mt-1">Please wait</p>
                </div>
              ) : (
                <div>
                  <span className="text-2xl">📄</span>
                  <p className="font-medium text-black mt-2">
                    Drop your document here
                  </p>
                  <p className="text-sm text-black mt-1">
                    or click to browse
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={() => setIsUploading(true)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Example Queries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Example Queries</h2>
            <div className="space-y-2">
              {[
                'Summarize IPC Section 420',
                'Find similar cases to Smith vs Corp',
                'Explain bail provisions',
                'Recent Supreme Court judgments on property law'
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => setNewMessage(query)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-black transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Precedent Finder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Precedent Finder</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter keywords..."
                className="w-full rounded-lg form-input"
              />
              <button className="w-full px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors">
                Search Precedents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
