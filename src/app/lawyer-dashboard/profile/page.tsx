'use client';

import { useState } from 'react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  barNumber: string;
  specialization: string;
  experience: number;
  address: string;
  avatar: string;
}

const mockProfile: UserProfile = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+91 98765 43210',
  barNumber: 'BAR123456',
  specialization: 'Corporate Law',
  experience: 8,
  address: '123 Law Street, Legal District, City - 400001',
  avatar: '👨‍⚖️'
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);

  const handleSave = () => {
    setIsEditing(false);
    // Save profile changes
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Profile & Settings</h1>
        <p className="text-black mt-1">Manage your account and preferences</p>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 text-center border-b border-gray-200">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto">
                {profile.avatar}
              </div>
              <h2 className="mt-4 font-semibold text-black">{profile.name}</h2>
              <p className="text-sm text-black">{profile.specialization}</p>
              <p className="text-sm text-black mt-1">{profile.barNumber}</p>
            </div>
            <nav className="p-4">
              {[
                { id: 'profile', label: 'Profile Information' },
                { id: 'preferences', label: 'Preferences' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'security', label: 'Security' },
                { id: 'billing', label: 'Billing' }
              ].map((tab) => (
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
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-black">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-green-600 hover:text-green-700"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        disabled={!isEditing}
                        className={`w-full rounded-lg ${!isEditing ? 'form-input-disabled' : 'form-input'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled={!isEditing}
                        className={`w-full rounded-lg ${!isEditing ? 'form-input-disabled' : 'form-input'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        disabled={!isEditing}
                        className={`w-full rounded-lg ${!isEditing ? 'form-input-disabled' : 'form-input'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Bar Number
                      </label>
                      <input
                        type="text"
                        value={profile.barNumber}
                        disabled={!isEditing}
                        className={`w-full rounded-lg ${!isEditing ? 'form-input-disabled' : 'form-input'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={profile.specialization}
                        disabled={!isEditing}
                        className={`w-full rounded-lg ${!isEditing ? 'form-input-disabled' : 'form-input'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={profile.experience}
                        disabled={!isEditing}
                        className={`w-full rounded-lg ${!isEditing ? 'form-input-disabled' : 'form-input'}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Office Address
                      </label>
                      <textarea
                        value={profile.address}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full rounded-lg ${!isEditing ? 'form-input-disabled' : 'form-input'}`}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-black">Preferences</h2>
                  <p className="text-black text-sm mt-1">Customize your dashboard experience</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-black">Theme</p>
                      <p className="text-sm text-black">Choose your preferred theme</p>
                    </div>
                    <select className="form-input w-full rounded-lg">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-black">Language</p>
                      <p className="text-sm text-black">Select your preferred language</p>
                    </div>
                    <select className="form-input w-full rounded-lg">
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-black">Time Zone</p>
                      <p className="text-sm text-black">Set your local time zone</p>
                    </div>
                    <select className="form-input w-full rounded-lg">
                      <option>IST (UTC+5:30)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-black">Notification Settings</h2>
                  <p className="text-black text-sm mt-1">Manage your notification preferences</p>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Email Notifications', description: 'Receive updates via email' },
                    { title: 'SMS Notifications', description: 'Get important alerts via SMS' },
                    { title: 'Case Updates', description: 'Updates about your active cases' },
                    { title: 'Hearing Reminders', description: 'Reminders for upcoming hearings' },
                    { title: 'Document Alerts', description: 'Alerts for document submissions' }
                  ].map((setting) => (
                    <div key={setting.title} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-black">{setting.title}</p>
                        <p className="text-sm text-black">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
