'use client';

import Link from 'next/link';

const mockCase = {
  id: 'CASE123',
  title: 'Property Dispute - Smith vs. Johnson',
  status: 'Active',
  hearingDate: '2025-04-15',
  lawyer: {
    name: 'Adv. Sarah Wilson',
    email: 'sarah@casepilot.com',
    phone: '+1234567890'
  },
  timeline: [
    {
      date: '2025-03-22',
      event: 'Case Created',
      description: 'Case submitted for review'
    },
    {
      date: '2025-03-23',
      event: 'Lawyer Assigned',
      description: 'Adv. Sarah Wilson assigned to the case'
    },
    {
      date: '2025-03-25',
      event: 'First Hearing Scheduled',
      description: 'Hearing scheduled for April 15, 2025'
    }
  ],
  documents: [
    {
      name: 'Property Deed.pdf',
      uploadedOn: '2025-03-22',
      size: '2.4 MB'
    },
    {
      name: 'Evidence Photos.zip',
      uploadedOn: '2025-03-22',
      size: '5.1 MB'
    }
  ],
  chatHistory: [
    {
      sender: 'Adv. Sarah Wilson',
      message: 'I've reviewed your case documents. We'll need to gather additional evidence.',
      timestamp: '2025-03-23 14:30'
    },
    {
      sender: 'You',
      message: 'Sure, what additional documents do you need?',
      timestamp: '2025-03-23 15:00'
    }
  ]
};

const TimelineItem = ({ date, event, description }: { date: string; event: string; description: string }) => (
  <div className="relative pb-8">
    <div className="absolute left-4 -ml-0.5 mt-1.5 h-full w-0.5 bg-gray-200"></div>
    <div className="relative flex items-start space-x-3">
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
          <span className="text-green-600 text-sm">📅</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div>
          <div className="text-sm text-black">{date}</div>
          <p className="mt-0.5 text-sm font-medium text-black">{event}</p>
        </div>
        <div className="mt-2 text-sm text-black">
          <p>{description}</p>
        </div>
      </div>
    </div>
  </div>
);

const DocumentItem = ({ name, uploadedOn, size }: { name: string; uploadedOn: string; size: string }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex items-center space-x-3">
      <span className="text-2xl">📄</span>
      <div>
        <p className="text-sm font-medium text-black">{name}</p>
        <p className="text-xs text-black">Uploaded on {uploadedOn} • {size}</p>
      </div>
    </div>
    <button className="text-green-600 hover:text-green-700">Download</button>
  </div>
);

const ChatMessage = ({ sender, message, timestamp }: { sender: string; message: string; timestamp: string }) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-center space-x-2">
      <span className="font-medium text-black">{sender}</span>
      <span className="text-xs text-black">{timestamp}</span>
    </div>
    <p className="text-sm text-black bg-gray-50 rounded-lg p-3">{message}</p>
  </div>
);

export default function CaseDetails() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-black">{mockCase.title}</h1>
            <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
              {mockCase.status}
            </span>
          </div>
          <p className="text-black mt-1">Case ID: {mockCase.id}</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Download Case Summary
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-black mb-6">Case Timeline</h2>
            <div className="space-y-6">
              {mockCase.timeline.map((item, index) => (
                <TimelineItem key={index} {...item} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-black mb-6">Documents</h2>
            <div className="space-y-4">
              {mockCase.documents.map((doc, index) => (
                <DocumentItem key={index} {...doc} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Info & Chat */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-black mb-4">Assigned Lawyer</h2>
            <div className="space-y-2">
              <p className="text-black">{mockCase.lawyer.name}</p>
              <p className="text-black">{mockCase.lawyer.email}</p>
              <p className="text-black">{mockCase.lawyer.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-black mb-4">Chat History</h2>
            <div className="space-y-4">
              {mockCase.chatHistory.map((chat, index) => (
                <ChatMessage key={index} {...chat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
