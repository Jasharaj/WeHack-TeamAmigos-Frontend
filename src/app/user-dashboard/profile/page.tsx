'use client';

import { useState } from 'react';

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  aadhaar: '1234-5678-9012',
  address: '123 Main St, City, State - 123456',
  notificationPreferences: {
    email: true,
    sms: true,
    whatsapp: false
  },
  savedDocuments: [
    {
      name: 'Aadhaar Card.pdf',
      uploadedOn: '2025-03-20',
      size: '1.2 MB'
    },
    {
      name: 'PAN Card.pdf',
      uploadedOn: '2025-03-20',
      size: '0.8 MB'
    }
  ]
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'documents', label: 'Documents' },
    { id: 'security', label: 'Security' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">Profile Settings</h1>
          <p className="text-black mt-1">Manage your account preferences and settings</p>
        </div>
        {activeTab === 'profile' && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-2 text-left rounded-lg mb-1 ${
                  activeTab === tab.id
                    ? 'bg-green-50 text-green-700'
                    : 'text-black hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-black">{formData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-black">{formData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-black">{formData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Aadhaar Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.aadhaar}
                      onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-black">{formData.aadhaar}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-black">{formData.address}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notificationPreferences.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        notificationPreferences: {
                          ...formData.notificationPreferences,
                          email: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-black">Email Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notificationPreferences.sms}
                      onChange={(e) => setFormData({
                        ...formData,
                        notificationPreferences: {
                          ...formData.notificationPreferences,
                          sms: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-black">SMS Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notificationPreferences.whatsapp}
                      onChange={(e) => setFormData({
                        ...formData,
                        notificationPreferences: {
                          ...formData.notificationPreferences,
                          whatsapp: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-black">WhatsApp Notifications</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Saved Documents</h3>
                <div className="space-y-4">
                  {formData.savedDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="font-medium text-black">{doc.name}</p>
                          <p className="text-sm text-black">
                            Uploaded on {doc.uploadedOn} • {doc.size}
                          </p>
                        </div>
                      </div>
                      <button className="text-green-600 hover:text-green-700">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Change Password</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
