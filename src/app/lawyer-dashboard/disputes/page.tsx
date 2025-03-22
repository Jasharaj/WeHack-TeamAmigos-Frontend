'use client';

import { useState } from 'react';

interface Dispute {
  id: string;
  partyA: string;
  partyB: string;
  summary: string;
  date: string;
  status: 'New' | 'Under Review' | 'Forwarded' | 'Resolved';
  aiSuggestion?: string;
}

const mockDisputes: Dispute[] = [
  {
    id: 'DSP001',
    partyA: 'John Smith',
    partyB: 'Tech Corp Ltd.',
    summary: 'Contract breach regarding software development project',
    date: '2025-03-20',
    status: 'New',
    aiSuggestion: 'Based on similar cases, mediation is recommended. Contract terms appear to have ambiguity in delivery timeline definitions.'
  },
  {
    id: 'DSP002',
    partyA: 'Sarah Johnson',
    partyB: 'Property Holdings Inc.',
    summary: 'Rental agreement dispute',
    date: '2025-03-18',
    status: 'Under Review',
    aiSuggestion: 'Recommend settlement: Similar cases show 80% resolution rate through mutual agreement on maintenance responsibilities.'
  }
];

const statusColors = {
  'New': 'bg-yellow-100 text-yellow-800',
  'Under Review': 'bg-blue-100 text-blue-800',
  'Forwarded': 'bg-purple-100 text-purple-800',
  'Resolved': 'bg-green-100 text-green-800'
};

export default function DisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showAISuggestion, setShowAISuggestion] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Online Dispute Resolution</h1>
          <p className="text-black mt-1">Manage and resolve disputes efficiently</p>
        </div>
        <div className="flex space-x-4">
          <select className="form-input px-4 py-2 rounded-lg">
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="review">Under Review</option>
            <option value="forwarded">Forwarded</option>
            <option value="resolved">Resolved</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            New Dispute
          </button>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Parties</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Summary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockDisputes.map((dispute) => (
              <tr key={dispute.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  {dispute.id}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-black">{dispute.partyA}</div>
                  <div className="text-sm text-black">vs</div>
                  <div className="text-sm text-black">{dispute.partyB}</div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-black line-clamp-2">{dispute.summary}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {dispute.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[dispute.status]}`}>
                    {dispute.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    onClick={() => {
                      setSelectedDispute(dispute);
                      setShowAISuggestion(true);
                    }}
                    className="text-black hover:text-black"
                  >
                    View
                  </button>
                  <button className="text-black hover:text-black">
                    Forward
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Suggestion Modal */}
      {showAISuggestion && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full m-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-black">Dispute Analysis</h2>
              <button
                onClick={() => setShowAISuggestion(false)}
                className="text-black hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Dispute Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-black">Party A</p>
                    <p className="font-medium">{selectedDispute.partyA}</p>
                  </div>
                  <div>
                    <p className="text-sm text-black">Party B</p>
                    <p className="font-medium">{selectedDispute.partyB}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-black">Summary</p>
                    <p className="font-medium">{selectedDispute.summary}</p>
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">AI Recommendation</h3>
                <div className="bg-green-50 rounded-lg p-4 text-green-800">
                  {selectedDispute.aiSuggestion}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAISuggestion(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Accept Suggestion
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Forward to Mediation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
