'use client';

import { useState, useEffect } from 'react';
import { loadDisputes, saveDisputes, type Dispute } from '@/utils/dashboardStorage';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  mediation: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  court: 'bg-purple-100 text-purple-800'
};

const categoryIcons = {
  civil: '⚖️',
  criminal: '🏛️',
  corporate: '🏢',
  family: '👨‍👩‍👧‍👦',
  property: '🏠'
};

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [showNewDisputeModal, setShowNewDisputeModal] = useState(false);
  const [newDispute, setNewDispute] = useState<Partial<Omit<Dispute, 'parties'>> & { parties: Partial<Dispute['parties']> }>({
    title: '',
    description: '',
    parties: {
      plaintiff: '',
      defendant: ''
    },
    status: 'pending',
    category: 'civil'
  });

  // Load disputes from localStorage on mount
  useEffect(() => {
    const savedDisputes = loadDisputes();
    setDisputes(savedDisputes);
  }, []);

  // Save disputes to localStorage whenever they change
  useEffect(() => {
    saveDisputes(disputes);
  }, [disputes]);

  const handleAddDispute = (e: React.FormEvent) => {
    e.preventDefault();
    const dispute: Dispute = {
      id: Date.now().toString(),
      title: newDispute.title || '',
      description: newDispute.description || '',
      parties: {
        plaintiff: newDispute.parties?.plaintiff || '',
        defendant: newDispute.parties?.defendant || ''
      },
      status: newDispute.status as 'pending' | 'mediation' | 'resolved' | 'court',
      category: newDispute.category as 'civil' | 'criminal' | 'corporate' | 'family' | 'property',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    setDisputes(prev => [...prev, dispute]);
    setNewDispute({
      title: '',
      description: '',
      parties: {
        plaintiff: '',
        defendant: ''
      },
      status: 'pending',
      category: 'civil'
    });
    setShowNewDisputeModal(false);
  };

  const handleUpdateStatus = (id: string, newStatus: Dispute['status']) => {
    setDisputes(prev =>
      prev.map(dispute =>
        dispute.id === id
          ? { ...dispute, status: newStatus, lastUpdated: new Date().toISOString() }
          : dispute
      )
    );
  };

  const handleDeleteDispute = (id: string) => {
    setDisputes(prev => prev.filter(dispute => dispute.id !== id));
  };

  const activeDisputes = disputes.filter(d => d.status !== 'resolved');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Legal Disputes</h1>
          <p className="text-black mt-1">Manage and track your legal cases</p>
        </div>
        <button
          onClick={() => setShowNewDisputeModal(true)}
          className="px-4 py-2 font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Add New Dispute
        </button>
      </div>

      {/* Active Disputes */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Active Disputes</h2>
        <div className="space-y-4">
          {activeDisputes.map(dispute => (
            <div
              key={dispute.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl" role="img" aria-label={dispute.category}>
                      {categoryIcons[dispute.category]}
                    </span>
                    <h3 className="font-medium text-black">{dispute.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{dispute.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Plaintiff:</span> {dispute.parties.plaintiff}
                    </div>
                    <div>
                      <span className="font-medium">Defendant:</span> {dispute.parties.defendant}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {new Date(dispute.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[dispute.status]}`}>
                    {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    <select
                      value={dispute.status}
                      onChange={(e) => handleUpdateStatus(dispute.id, e.target.value as Dispute['status'])}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="mediation">Mediation</option>
                      <option value="court">Court</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button
                      onClick={() => handleDeleteDispute(dispute.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {activeDisputes.length === 0 && (
            <p className="text-center text-gray-500 py-4">No active disputes</p>
          )}
        </div>
      </div>

      {/* Resolved Disputes */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Resolved Disputes</h2>
        <div className="space-y-4">
          {resolvedDisputes.map(dispute => (
            <div
              key={dispute.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl" role="img" aria-label={dispute.category}>
                      {categoryIcons[dispute.category]}
                    </span>
                    <h3 className="font-medium text-gray-600">{dispute.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{dispute.description}</p>
                  <div className="text-sm text-gray-500">
                    Resolved on: {new Date(dispute.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDispute(dispute.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {resolvedDisputes.length === 0 && (
            <p className="text-center text-gray-500 py-4">No resolved disputes</p>
          )}
        </div>
      </div>

      {/* New Dispute Modal */}
      {showNewDisputeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold text-black mb-4">Add New Dispute</h2>
            <form onSubmit={handleAddDispute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Title</label>
                <input
                  type="text"
                  value={newDispute.title}
                  onChange={e => setNewDispute(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Description</label>
                <textarea
                  value={newDispute.description}
                  onChange={e => setNewDispute(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Plaintiff</label>
                  <input
                    type="text"
                    value={newDispute.parties?.plaintiff || ''}
                    onChange={e => setNewDispute(prev => ({
                      ...prev,
                      parties: { 
                        ...prev.parties || {},
                        plaintiff: e.target.value
                      }
                    }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Defendant</label>
                  <input
                    type="text"
                    value={newDispute.parties?.defendant || ''}
                    onChange={e => setNewDispute(prev => ({
                      ...prev,
                      parties: {
                        ...prev.parties || {},
                        defendant: e.target.value
                      }
                    }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Category</label>
                  <select
                    value={newDispute.category}
                    onChange={e => setNewDispute(prev => ({ ...prev, category: e.target.value as Dispute['category'] }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  >
                    <option value="civil">Civil</option>
                    <option value="criminal">Criminal</option>
                    <option value="corporate">Corporate</option>
                    <option value="family">Family</option>
                    <option value="property">Property</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Initial Status</label>
                  <select
                    value={newDispute.status}
                    onChange={e => setNewDispute(prev => ({ ...prev, status: e.target.value as Dispute['status'] }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="mediation">Mediation</option>
                    <option value="court">Court</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Dispute
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewDisputeModal(false)}
                  className="flex-1 bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
