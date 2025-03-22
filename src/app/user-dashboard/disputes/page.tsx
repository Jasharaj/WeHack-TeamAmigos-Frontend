'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Dispute {
  id: string;
  title: string;
  type: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  dateCreated: string;
  lastUpdated: string;
  description: string;
  parties: {
    name: string;
    role: string;
  }[];
  resolution?: string;
}

const mockDisputes: Dispute[] = [
  {
    id: 'DSP1',
    title: 'Property Boundary Dispute',
    type: 'Property',
    status: 'In Progress',
    dateCreated: '2025-03-15',
    lastUpdated: '2025-03-20',
    description: 'Dispute regarding property boundary with neighbor',
    parties: [
      { name: 'John Smith', role: 'Complainant' },
      { name: 'Sarah Johnson', role: 'Respondent' }
    ]
  },
  {
    id: 'DSP2',
    title: 'Consumer Product Refund',
    type: 'Consumer',
    status: 'Open',
    dateCreated: '2025-03-18',
    lastUpdated: '2025-03-18',
    description: 'Dispute regarding defective product and refund request',
    parties: [
      { name: 'Alice Brown', role: 'Complainant' },
      { name: 'Tech Solutions Ltd.', role: 'Respondent' }
    ]
  },
  {
    id: 'DSP3',
    title: 'Rental Agreement Dispute',
    type: 'Tenancy',
    status: 'Resolved',
    dateCreated: '2025-03-10',
    lastUpdated: '2025-03-19',
    description: 'Dispute regarding rental deposit refund',
    parties: [
      { name: 'Mike Wilson', role: 'Complainant' },
      { name: 'City Properties', role: 'Respondent' }
    ],
    resolution: 'Mutual agreement reached. Deposit to be refunded within 7 days.'
  }
];

const statusColors = {
  'Open': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Resolved': 'bg-green-100 text-green-800',
  'Closed': 'bg-gray-100 text-gray-800'
};

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDisputes = mockDisputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'open') {
      return matchesSearch && (dispute.status === 'Open' || dispute.status === 'In Progress');
    } else if (activeTab === 'resolved') {
      return matchesSearch && (dispute.status === 'Resolved' || dispute.status === 'Closed');
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Disputes</h1>
          <p className="text-black mt-1">Track and manage your dispute resolution cases</p>
        </div>
        <Link
          href="/user-dashboard/disputes/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          New Dispute
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('open')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'open'
                ? 'bg-green-600 text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'resolved'
                ? 'bg-green-600 text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.map((dispute) => (
          <div
            key={dispute.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-black">{dispute.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[dispute.status]}`}>
                    {dispute.status}
                  </span>
                </div>
                <p className="text-sm text-black">{dispute.description}</p>
                <div className="flex space-x-4 text-sm text-black">
                  <span>Type: {dispute.type}</span>
                  <span>Created: {dispute.dateCreated}</span>
                  <span>Last Updated: {dispute.lastUpdated}</span>
                </div>
              </div>
              <Link
                href={`/user-dashboard/disputes/${dispute.id}`}
                className="text-green-600 hover:text-green-700"
              >
                View Details →
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-black mb-2">Parties Involved:</h4>
              <div className="flex flex-wrap gap-4">
                {dispute.parties.map((party, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-black">{party.name}</span>
                    <span className="text-xs text-black bg-gray-100 px-2 py-1 rounded-full">
                      {party.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {dispute.resolution && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-black mb-2">Resolution:</h4>
                <p className="text-sm text-black">{dispute.resolution}</p>
              </div>
            )}
          </div>
        ))}

        {filteredDisputes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-black">No disputes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
