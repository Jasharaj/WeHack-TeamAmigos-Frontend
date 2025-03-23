'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HearingHistory {
  date: string;
  notes: string;
  outcome: string;
}

const mockCase = {
  id: 'CASE001',
  title: 'Smith vs Corporation Ltd.',
  type: 'Civil',
  status: 'Active',
  description: 'Civil dispute regarding breach of contract...',
  client: {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1234567890'
  },
  hearingDate: '2025-04-15',
  documents: [
    { name: 'Contract.pdf', size: '2.4 MB', uploadedAt: '2025-03-20' },
    { name: 'Evidence1.pdf', size: '1.8 MB', uploadedAt: '2025-03-21' }
  ],
  hearingHistory: [
    { date: '2025-03-15', notes: 'Initial hearing', outcome: 'Adjourned' },
    { date: '2025-03-01', notes: 'Pre-trial conference', outcome: 'Completed' }
  ],
  notes: 'Client has provided all necessary documentation. Need to prepare for cross-examination.'
};

export default function CaseDetailsPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'history'>('details');

  const TabButton = ({ tab, label }: { tab: typeof activeTab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-green-50 text-green-600'
          : 'text-black hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-black">{mockCase.title}</h1>
            <span className={`px-2 py-1 text-sm rounded-full ${
              mockCase.status === 'Active' ? 'bg-green-100 text-green-800' :
              mockCase.status === 'Urgent' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-black'
            }`}>
              {mockCase.status}
            </span>
          </div>
          <p className="text-black mt-1">Case ID: {mockCase.id}</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Edit Case'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <TabButton tab="details" label="Case Details" />
        <TabButton tab="documents" label="Documents" />
        <TabButton tab="history" label="Hearing History" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Case Type</label>
                  {isEditing ? (
                    <select
                      defaultValue={mockCase.type}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="Civil">Civil</option>
                      <option value="Criminal">Criminal</option>
                      <option value="Property">Property</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-black">{mockCase.type}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Status</label>
                  {isEditing ? (
                    <select
                      defaultValue={mockCase.status}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Closed">Closed</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-black">{mockCase.status}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Next Hearing</label>
                  {isEditing ? (
                    <input
                      type="date"
                      defaultValue={mockCase.hearingDate}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  ) : (
                    <p className="mt-1 text-black">{mockCase.hearingDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-4">Client Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={mockCase.client.name}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  ) : (
                    <p className="mt-1 text-black">{mockCase.client.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue={mockCase.client.email}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  ) : (
                    <p className="mt-1 text-black">{mockCase.client.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      defaultValue={mockCase.client.phone}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  ) : (
                    <p className="mt-1 text-black">{mockCase.client.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-4">Case Notes</h2>
              {isEditing ? (
                <textarea
                  defaultValue={mockCase.notes}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              ) : (
                <p className="mt-1 text-black whitespace-pre-wrap">{mockCase.notes}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">Case Documents</h2>
              <button className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
                Upload New
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {mockCase.documents.map((doc, i) => (
                <div key={i} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-black">{doc.name}</p>
                      <p className="text-sm text-gray-500">Uploaded on {doc.uploadedAt} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-700">Download</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-lg font-semibold text-black mb-4">Hearing History</h2>
            <div className="space-y-4">
              {mockCase.hearingHistory.map((hearing, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-black">{hearing.date}</p>
                      <p className="text-sm text-gray-600 mt-1">{hearing.notes}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {hearing.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
