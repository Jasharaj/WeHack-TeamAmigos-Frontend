'use client';

import { useState } from 'react';

interface Reminder {
  id: string;
  caseId: string;
  caseTitle: string;
  date: string;
  time: string;
  type: string;
  notificationChannel: string[];
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  notes?: string;
}

const mockReminders: Reminder[] = [
  {
    id: 'REM1',
    caseId: 'CASE123',
    caseTitle: 'Property Dispute - Smith vs. Johnson',
    date: '2025-04-15',
    time: '10:00 AM',
    type: 'Hearing',
    notificationChannel: ['Email', 'SMS'],
    status: 'Upcoming',
    notes: 'Bring all property documents'
  },
  {
    id: 'REM2',
    caseId: 'CASE124',
    caseTitle: 'Consumer Complaint - Tech Solutions',
    date: '2025-04-20',
    time: '02:30 PM',
    type: 'Document Submission',
    notificationChannel: ['Email'],
    status: 'Upcoming'
  }
];

const statusColors = {
  Upcoming: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

export default function RemindersPage() {
  const [showNewReminderModal, setShowNewReminderModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredReminders = mockReminders.filter(reminder => {
    if (activeTab === 'upcoming') return reminder.status === 'Upcoming';
    if (activeTab === 'completed') return reminder.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Reminders & Hearings</h1>
          <p className="text-black mt-1">Manage your upcoming hearings and important dates</p>
        </div>
        <button
          onClick={() => setShowNewReminderModal(true)}
          className="btn-primary"
        >
          Set New Reminder
        </button>
      </div>

      {/* Upcoming Hearings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReminders.slice(0, 3).map(reminder => (
          <div key={reminder.id} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <p className="font-medium text-black">{reminder.caseTitle}</p>
                    <p className="text-sm text-black">
                      {reminder.time} - {reminder.type}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-black">
                    {new Date(reminder.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-sm text-black mt-1">{reminder.time}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-black hover:text-black hover:border-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-black hover:text-black hover:border-gray-300'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-black hover:text-black hover:border-gray-300'
            }`}
          >
            All Reminders
          </button>
        </nav>
      </div>

      {/* Reminders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Case</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Notifications</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReminders.map((reminder) => (
              <tr key={reminder.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-black">{reminder.date}</div>
                  <div className="text-sm text-black">{reminder.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{reminder.caseTitle}</div>
                  <div className="text-sm text-black">Case #{reminder.caseId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {reminder.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[reminder.status]}`}>
                    {reminder.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {reminder.notificationChannel.includes('Email') && (
                      <span className="text-black">📧</span>
                    )}
                    {reminder.notificationChannel.includes('SMS') && (
                      <span className="text-black">📱</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Reminder Modal */}
      {showNewReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-black mb-4">Set New Reminder</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Case</label>
                <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option>Select case...</option>
                  <option>Smith vs Corporation Ltd.</option>
                  <option>Consumer Complaint #123</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Date</label>
                  <input type="date" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Time</label>
                  <input type="time" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Type</label>
                <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option>Hearing</option>
                  <option>Document Submission</option>
                  <option>Meeting</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Notes</label>
                <textarea className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Notification Channels</label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600" />
                    <span className="ml-2 text-black">Email</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600" />
                    <span className="ml-2 text-black">SMS</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewReminderModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Set Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
