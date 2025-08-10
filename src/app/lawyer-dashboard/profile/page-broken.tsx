'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Bell, 
  Settings,
  Edit3,
  Save,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Clock,
  UserCheck,
  Scale
} from 'lucide-react';
import config from '@/config';

interface ProfileData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: number;
  createdAt?: string;
}

export default function LawyerProfile() {
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications' | 'preferences'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    role: 'lawyer',
    licenseNumber: '',
    specialization: '',
    yearsOfExperience: 0
  });

  const [tempData, setTempData] = useState(profileData);

  // Fetch lawyer profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/lawyers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const result = await response.json();
      if (result.success) {
        setProfileData(result.data);
        setTempData(result.data);
      } else {
        setError(result.message || 'Failed to fetch profile data');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal' as const, label: 'Personal Info', icon: User },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'preferences' as const, label: 'Preferences', icon: Settings }
  ];

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/lawyers/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: tempData.name,
          email: tempData.email,
          phone: tempData.phone
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      if (result.success) {
        setProfileData(result.data);
        setIsEditing(false);
        setError('');
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
      {/* Loading State */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center min-h-[60vh]"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600">Loading profile...</span>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center gap-2 text-red-800">
            <X className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-200/20 rounded-full"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 120, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-8 w-32 h-32 bg-teal-200/20 rounded-full"
        />
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-6 h-6 text-emerald-600" />
                Profile Settings
              </h1>
              <p className="text-slate-600">Manage your account information and preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{profileData.name}</h2>
                <p className="text-emerald-700 font-medium">Legal Counsel</p>
                <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  {profileData.yearsOfExperience} years experience
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white rounded-xl px-4 py-2 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <UserCheck className="w-4 h-4" />
                  Verified Lawyer
                </div>
                <p className="text-xs text-slate-500">License #: {profileData.licenseNumber}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden mb-6"
        >
          <div className="flex border-b border-slate-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Edit Controls */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCancel}
                            className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(true)}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <User className="w-4 h-4 text-emerald-600" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={isEditing ? tempData.name : profileData.name}
                        onChange={(e) => setTempData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all disabled:bg-slate-50"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Mail className="w-4 h-4 text-emerald-600" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={isEditing ? tempData.email : profileData.email}
                        onChange={(e) => setTempData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all disabled:bg-slate-50"
                        placeholder="alice@citizen.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={isEditing ? tempData.phone : profileData.phone}
                        onChange={(e) => setTempData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all disabled:bg-slate-50"
                        placeholder="5551234567"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        License Number
                      </label>
                      <input
                        type="text"
                        value={isEditing ? tempData.licenseNumber : profileData.licenseNumber}
                        onChange={(e) => setTempData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all disabled:bg-slate-50"
                        placeholder="Enter license number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Scale className="w-4 h-4 text-emerald-600" />
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={isEditing ? tempData.specialization : profileData.specialization}
                        onChange={(e) => setTempData(prev => ({ ...prev, specialization: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all disabled:bg-slate-50"
                        placeholder="e.g. Corporate Law, Criminal Defense"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={isEditing ? tempData.yearsOfExperience : profileData.yearsOfExperience}
                        onChange={(e) => setTempData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all disabled:bg-slate-50"
                        placeholder="Years of experience"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Legal Specialization */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Settings className="w-4 h-4 text-emerald-600" />
                      Legal Specialization
                    </label>
                    <input
                      type="text"
                      value={isEditing ? tempData.specialization : profileData.specialization}
                      onChange={(e) => setTempData(prev => ({ ...prev, specialization: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all disabled:bg-slate-50"
                      placeholder="Corporate Law, Contract Disputes"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Change Password</h4>
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Current Password"
                            className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Update Password
                        </motion.button>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-600 mb-3">Add an extra layer of security to your account</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        Enable 2FA
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'New Case Assignments', description: 'Get notified when new cases are assigned to you' },
                      { title: 'Client Messages', description: 'Receive alerts for new client communications' },
                      { title: 'Court Reminders', description: 'Reminders for upcoming court hearings' },
                      { title: 'Settlement Updates', description: 'Updates on settlement negotiations' },
                      { title: 'Document Sharing', description: 'Notifications when documents are shared' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-slate-900">{item.title}</h4>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900">Application Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-900 mb-3">Language & Region</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                          <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Time Zone</label>
                          <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400">
                            <option>Pacific Time (PT)</option>
                            <option>Mountain Time (MT)</option>
                            <option>Central Time (CT)</option>
                            <option>Eastern Time (ET)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-900 mb-3">Display Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Dark Mode</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Compact Layout</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        </>
      )}
    </div>
  );
}
