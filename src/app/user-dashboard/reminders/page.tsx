'use client';

import { useState, useEffect } from 'react';
import { loadReminders, saveReminders, type Reminder } from '@/utils/dashboardStorage';

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800'
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showNewReminderModal, setShowNewReminderModal] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    completed: false
  });

  // Load reminders from localStorage on mount
  useEffect(() => {
    const savedReminders = loadReminders();
    setReminders(savedReminders);
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title || '',
      description: newReminder.description || '',
      dueDate: newReminder.dueDate || new Date().toISOString(),
      priority: newReminder.priority as 'high' | 'medium' | 'low',
      completed: false
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminder({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      completed: false
    });
    setShowNewReminderModal(false);
  };

  const handleToggleComplete = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">My Reminders</h1>
          <p className="text-black mt-1">Keep track of your case-related tasks</p>
        </div>
        <button
          onClick={() => setShowNewReminderModal(true)}
          className="px-4 py-2 font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Add Reminder
        </button>
      </div>

      {/* Active Reminders */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Active Reminders</h2>
        <div className="space-y-4">
          {activeReminders.map(reminder => (
            <div
              key={reminder.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-medium text-black">{reminder.title}</h3>
                  <p className="text-sm text-gray-600">{reminder.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Due: {new Date(reminder.dueDate).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[reminder.priority]}`}>
                      {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} Priority
                    </span>
                    {isOverdue(reminder.dueDate) && !reminder.completed && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleComplete(reminder.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {activeReminders.length === 0 && (
            <p className="text-center text-gray-500 py-4">No active reminders</p>
          )}
        </div>
      </div>

      {/* Completed Reminders */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Completed Reminders</h2>
        <div className="space-y-4">
          {completedReminders.map(reminder => (
            <div
              key={reminder.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-600 line-through">{reminder.title}</h3>
                  <p className="text-sm text-gray-500 line-through">{reminder.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Completed on: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleComplete(reminder.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {completedReminders.length === 0 && (
            <p className="text-center text-gray-500 py-4">No completed reminders</p>
          )}
        </div>
      </div>

      {/* New Reminder Modal */}
      {showNewReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold text-black mb-4">Add New Reminder</h2>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={e => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Description</label>
                <textarea
                  value={newReminder.description}
                  onChange={e => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Due Date</label>
                  <input
                    type="datetime-local"
                    value={newReminder.dueDate}
                    onChange={e => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Priority</label>
                  <select
                    value={newReminder.priority}
                    onChange={e => setNewReminder(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewReminderModal(false)}
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
