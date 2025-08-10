'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  Calendar,
  MapPin,
  Briefcase,
  Settings,
  Bell,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
  Upload
} from 'lucide-react';
import config from '@/config';

interface Case {
  _id: string;
  title: string;
  description: string;
  status: string;
  caseType: string;
  createdAt: string;
  lawyer?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface CitizenProfile {
  name: string;
  email: string;
  phone: string;
  address?: string;
  occupation?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
}

const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Settings }
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CitizenProfile>({ 
    name: '', 
    email: '', 
    phone: '',
    address: '',
    occupation: '',
    dateOfBirth: '',
    emergencyContact: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'citizen') {
      router.push('/login');
      return;
    }

    // Fetch profile data
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch profile data
        const profileResponse = await fetch(`${config.BASE_URL}/api/v1/citizen/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const profileData = await profileResponse.json();
        const enrichedProfile = {
          ...profileData.data,
          address: profileData.data.address || '',
          occupation: profileData.data.occupation || '',
          dateOfBirth: profileData.data.dateOfBirth || '',
          emergencyContact: profileData.data.emergencyContact || ''
        };
        
        setProfile(enrichedProfile);
        setEditForm(enrichedProfile); // Initialize edit form with current data
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${config.BASE_URL}/api/v1/citizen/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setProfile(updatedData.data);
      setUpdateSuccess(true);
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile || { name: '', email: '', phone: '', address: '', occupation: '', dateOfBirth: '', emergencyContact: '' });
    setIsEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[60vh]"
      >
        <div className="flex items-center gap-3 text-slate-600">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"
          />
          <span className="text-lg">Loading profile...</span>
        </div>
      </motion.div>
    );
  }

  if (error && !profile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Unable to load profile</h3>
        <p className="text-slate-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Picture Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative group"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-emerald-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
          </motion.button>
        </motion.div>
        
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {profile?.name || 'User Name'}
          </h2>
          <p className="text-slate-600 mb-3">
            {profile?.occupation || 'Legal Service User'}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>Member since {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl text-slate-900 transition-all duration-200 ${
                isEditing 
                  ? 'border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400' 
                  : 'border-slate-200 bg-slate-50'
              }`}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl text-slate-900 transition-all duration-200 ${
                isEditing 
                  ? 'border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400' 
                  : 'border-slate-200 bg-slate-50'
              }`}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={editForm.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl text-slate-900 transition-all duration-200 ${
                isEditing 
                  ? 'border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400' 
                  : 'border-slate-200 bg-slate-50'
              }`}
              required
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              value={editForm.occupation}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your occupation"
              className={`w-full px-4 py-3 border rounded-xl text-slate-900 transition-all duration-200 ${
                isEditing 
                  ? 'border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400' 
                  : 'border-slate-200 bg-slate-50'
              }`}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={editForm.dateOfBirth}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl text-slate-900 transition-all duration-200 ${
                isEditing 
                  ? 'border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400' 
                  : 'border-slate-200 bg-slate-50'
              }`}
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <Phone className="w-4 h-4 inline mr-2" />
              Emergency Contact
            </label>
            <input
              type="tel"
              name="emergencyContact"
              value={editForm.emergencyContact}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Emergency contact number"
              className={`w-full px-4 py-3 border rounded-xl text-slate-900 transition-all duration-200 ${
                isEditing 
                  ? 'border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400' 
                  : 'border-slate-200 bg-slate-50'
              }`}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            <MapPin className="w-4 h-4 inline mr-2" />
            Address
          </label>
          <textarea
            name="address"
            value={editForm.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter your full address"
            rows={3}
            className={`w-full px-4 py-3 border rounded-xl text-slate-900 resize-none transition-all duration-200 ${
              isEditing 
                ? 'border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400' 
                : 'border-slate-200 bg-slate-50'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-slate-200">
          {!isEditing ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
            >
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex gap-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={updateLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {updateLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                disabled={updateLoading}
                className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <X className="w-5 h-5" />
                Cancel
              </motion.button>
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );

  const renderSecurityTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          Change Password
        </h3>
        
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900"
          />
          
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200">
            Update Password
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white"
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
              <p className="text-slate-600">Manage your account information and preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {updateSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-800 font-medium">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg mb-6"
        >
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Notification Settings</h3>
                <p className="text-slate-600">Coming soon...</p>
              </motion.div>
            )}
            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Preferences</h3>
                <p className="text-slate-600">Coming soon...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
