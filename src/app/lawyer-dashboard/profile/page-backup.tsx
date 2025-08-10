'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  CheckCircle2, 
  Shield, 
  Camera,
  Loader2
} from 'lucide-react';
import config from '@/config';

interface LawyerProfile {
  _id?: string;
  name: string;
  email: string;
  phone: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<LawyerProfile>({
    name: '',
    email: '',
    phone: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'lawyer') {
      router.push('/login');
      return;
    }

    // Fetch profile data
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const profileResponse = await fetch(`${config.BASE_URL}/api/v1/lawyer/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const profileData = await profileResponse.json();
        setProfile(profileData.data);
        setEditForm({
          name: profileData.data.name,
          email: profileData.data.email,
          phone: profileData.data.phone || ''
        });
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      const response = await fetch(`${config.BASE_URL}/api/v1/lawyer/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update profile state with new data
      setProfile(prev => {
        if (prev) {
          return {
            ...prev,
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone
          };
        }
        return null;
      });
      setUpdateSuccess(true);
      
      // Exit edit mode after successful update
      setTimeout(() => {
        setIsEditing(false);
        setUpdateSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Reset form data to current profile
    if (profile) {
      setEditForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || ''
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 p-8 rounded-2xl text-red-600 max-w-2xl mx-auto border border-red-200"
      >
        <h3 className="text-lg font-semibold mb-2">Error Loading Profile</h3>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white"
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-8 rounded-2xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center relative group cursor-pointer">
                  <User className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{profile?.name || 'Loading...'}</h1>
                  <div className="flex items-center gap-2 text-emerald-100">
                    <Shield className="w-4 h-4" />
                    <span>Legal Professional</span>
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm shadow-lg"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {updateSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 p-4 rounded-2xl text-green-600 border border-green-200 flex items-center gap-2 shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5" />
            Profile updated successfully!
          </motion.div>
        )}

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8"
        >
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            Personal Information
          </h2>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400 transition-all"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400 transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={cancelEdit}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={updateLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Name Display */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-50/80 rounded-2xl border border-slate-200/60 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-emerald-600 mb-1">Full Name</h3>
                  <p className="text-slate-800 font-semibold text-lg">{profile?.name}</p>
                </div>
              </motion.div>

              {/* Email Display */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-50/80 rounded-2xl border border-slate-200/60 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-600 mb-1">Email Address</h3>
                  <p className="text-slate-800 font-semibold text-lg">{profile?.email}</p>
                </div>
              </motion.div>

              {/* Phone Display */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-50/80 rounded-2xl border border-slate-200/60 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-purple-600 mb-1">Phone Number</h3>
                  <p className="text-slate-800 font-semibold text-lg">{profile?.phone}</p>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Additional Profile Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Account Security
            </h3>
            <div className="space-y-3">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-50/80 rounded-2xl border border-slate-200/60 hover:shadow-md transition-all duration-200"
              >
                <span className="text-slate-700 font-medium">Password</span>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold bg-emerald-50 px-3 py-1 rounded-lg transition-colors"
                >
                  Change Password
                </motion.button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-50/80 rounded-2xl border border-slate-200/60 hover:shadow-md transition-all duration-200"
              >
                <span className="text-slate-700 font-medium">Two-Factor Authentication</span>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold bg-emerald-50 px-3 py-1 rounded-lg transition-colors"
                >
                  Setup
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Account Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Account Status
            </h3>
            <div className="space-y-3">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-50/80 rounded-2xl border border-slate-200/60 hover:shadow-md transition-all duration-200"
              >
                <span className="text-slate-700 font-medium">Account Type</span>
                <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 rounded-2xl text-sm font-semibold border border-emerald-300">
                  Legal Professional
                </span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-50/80 rounded-2xl border border-slate-200/60 hover:shadow-md transition-all duration-200"
              >
                <span className="text-slate-700 font-medium">Status</span>
                <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-2xl text-sm font-semibold border border-green-300">
                  Active
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
