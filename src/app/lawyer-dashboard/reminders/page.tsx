'use client';

import { useState } from 'react';

interface Reminder {
  id: string;
  caseId: string;
  caseTitle: string;
  date: string;
  time: string;
  type: 'Hearing' | 'Document Submission' | 'Meeting';
  status: 'Upcoming' | 'Today' | 'Overdue';
  notes?: string;
  notificationChannel: ('Email' | 'SMS')[];
}

const mockReminders: Reminder[] = [
  {
    id: 'REM001',
    caseId: 'CASE001',
    caseTitle: 'Smith vs Corporation Ltd.',
    date: '2025-03-23',
    time: '10:00',
    type: 'Hearing',
    status: 'Today',
    notes: 'Main hearing - Bring all documentation',
    notificationChannel: ['Email', 'SMS']
  },
  {
    id: 'REM002',
    caseId: 'CASE002',
    caseTitle: 'Property Dispute',
    date: '2025-03-25',
    time: '14:30',
    type: 'Document Submission',
    status: 'Upcoming',
    notes: 'Submit property documents',
    notificationChannel: ['Email']
  },
  // Add more mock reminders as needed
];

const statusColors = {
  Upcoming: 'bg-green-100 text-green-800',
  Today: 'bg-yellow-100 text-yellow-800',
  Overdue: 'bg-red-100 text-red-800'
};

export default function RemindersPage() {
  const [showNewReminderModal, setShowNewReminderModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

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
          className="px-4 py-2 font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Set New Reminder
        </button>
      </div>

      {/* Today's Reminders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Today's Schedule</h2>
        <div className="space-y-4">
          {mockReminders
            .filter(reminder => reminder.status === 'Today')
            .map(reminder => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <p className="font-medium text-black">{reminder.caseTitle}</p>
                    <p className="text-sm text-black">
                      {reminder.time} - {reminder.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReminder(reminder)}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  View Details
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Upcoming Reminders</h2>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Case</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Notifications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockReminders.map(reminder => (
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[reminder.status]}`}>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedReminder(reminder)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Reminders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Past Hearings</h2>
        <div className="space-y-4">
          {mockReminders
            .filter(reminder => reminder.status === 'Overdue')
            .map(reminder => (
              <div
                key={reminder.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-black">{reminder.caseTitle}</p>
                    <p className="text-sm text-black mt-1">
                      {reminder.date} at {reminder.time} - {reminder.type}
                    </p>
                    {reminder.notes && (
                      <p className="text-sm text-black mt-2">{reminder.notes}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[reminder.status]}`}>
                    {reminder.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
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
                  <option>Property Dispute</option>
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
                    <span className="ml-2">Email</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600" />
                    <span className="ml-2">SMS</span>
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
