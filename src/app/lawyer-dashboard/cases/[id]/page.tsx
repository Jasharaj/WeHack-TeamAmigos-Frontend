'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Scale,
  Printer,
  Edit,
  Eye,
  Users,
  MessageCircle,
  Briefcase,
  Tag,
  Activity,
  MessageSquare,
  Bell,
  Share2,
  Paperclip,
  Download
} from 'lucide-react';
import config from '@/config';

interface Case {
  _id: string;
  title: string;
  description: string;
  caseType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  citizen: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  lawyer?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialization?: string;
  };
}

// Timeline event component
const TimelineItem = ({ date, event, description, index }: { date: string; event: string; description: string; index: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative pb-8 last:pb-0"
  >
    <div className="absolute left-4 -ml-0.5 mt-1.5 h-full w-0.5 bg-gradient-to-b from-emerald-200 to-teal-200 last:hidden"></div>
    <div className="relative flex items-start space-x-4">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="relative"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
      </motion.div>
      <div className="min-w-0 flex-1 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-900">{event}</p>
          <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full">{date}</span>
        </div>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [status, setStatus] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get appropriate status info with modern design
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          bgColor: 'bg-amber-100',
          icon: Clock,
          label: 'Awaiting Review'
        };
      case 'in progress':
        return {
          color: 'bg-blue-50 text-blue-800 border-blue-200',
          bgColor: 'bg-blue-100',
          icon: Eye,
          label: 'In Progress'
        };
      case 'resolved':
        return {
          color: 'bg-green-50 text-green-800 border-green-200',
          bgColor: 'bg-green-100',
          icon: CheckCircle2,
          label: 'Case Resolved'
        };
      case 'closed':
        return {
          color: 'bg-slate-50 text-slate-800 border-slate-200',
          bgColor: 'bg-slate-100',
          icon: XCircle,
          label: 'Case Closed'
        };
      case 'rejected':
        return {
          color: 'bg-red-50 text-red-800 border-red-200',
          bgColor: 'bg-red-100',
          icon: AlertCircle,
          label: 'Case Rejected'
        };
      default:
        return {
          color: 'bg-slate-50 text-slate-800 border-slate-200',
          bgColor: 'bg-slate-100',
          icon: FileText,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
    }
  };

  // Legacy support for old color function
  const getStatusColor = (status: string): string => {
    const statusInfo = getStatusInfo(status);
    return statusInfo.color.replace('border-', '').replace(' border-amber-200', '').replace(' border-blue-200', '').replace(' border-green-200', '').replace(' border-slate-200', '').replace(' border-red-200', '');
  };

  // Format case type for display
  const formatCaseType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format status for display
  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Generate timeline events based on case data
  const generateTimeline = (caseItem: Case) => {
    const timeline = [
      {
        date: formatDate(caseItem.createdAt),
        event: 'Case Created',
        description: `Case "${caseItem.title}" was submitted for review`
      }
    ];

    if (caseItem.lawyer) {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Lawyer Assigned',
        description: `${caseItem.lawyer.name} was assigned to the case`
      });
    }

    if (caseItem.status === 'in progress') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case In Progress',
        description: 'The case is being actively worked on'
      });
    }

    if (caseItem.status === 'resolved') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Resolved',
        description: 'The case has been successfully resolved'
      });
    }

    if (caseItem.status === 'closed') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Closed',
        description: 'This case has been closed'
      });
    }

    if (caseItem.status === 'rejected') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Rejected',
        description: 'This case has been rejected'
      });
    }

    return timeline;
  };

  // Handle case update
  const handleUpdateCase = async () => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/cases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: status || caseData?.status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update case');
      }

      const data = await response.json();
      setCaseData(data.data);
      setIsEditing(false);
      setUpdateSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      setUpdateError(err.message || 'Something went wrong');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle case acceptance or rejection
  const handleCaseAction = async (action: 'accept' | 'reject') => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/cases/${id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          caseId: id,
          action
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} case`);
      }

      const data = await response.json();
      setCaseData(data.data);
      setUpdateSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      setUpdateError(err.message || 'Something went wrong');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'lawyer') {
      router.push('/login');
      return;
    }

    // Fetch case data
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`${config.BASE_URL}/api/v1/cases/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch case details');
        }

        const data = await response.json();
        setCaseData(data.data);
        setStatus(data.data.status);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [id, router]);

  const TabButton = ({ tab, label }: { tab: typeof activeTab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-green-50 text-green-600'
          : 'text-black hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 max-w-4xl mx-auto my-8">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg text-yellow-600 max-w-4xl mx-auto my-8">
        <h3 className="text-lg font-semibold mb-2">Case Not Found</h3>
        <p>The case you're looking for could not be found.</p>
        <Link
          href="/lawyer-dashboard/cases"
          className="mt-4 px-4 py-2 inline-block bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Back to Cases
        </Link>
      </div>
    );
  }

  const timeline = generateTimeline(caseData);

  return (
    <div className="space-y-8">
      {/* Back Button with Animation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => router.push('/lawyer-dashboard/cases')}
          className="inline-flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Cases
        </button>
      </motion.div>

      {/* Success/Error Messages */}
      {updateSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 p-4 rounded-xl text-emerald-600 border border-emerald-200"
        >
          <p>Case updated successfully!</p>
        </motion.div>
      )}
      
      {updateError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 p-4 rounded-xl text-red-600 border border-red-200"
        >
          <p>{updateError}</p>
        </motion.div>
      )}

      {/* Case Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-3"
            >
              {caseData.title}
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Filed: {formatDate(caseData.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4" />
                <span>Client: {caseData.citizen.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Tag className="w-4 h-4" />
                <span>Type: {formatCaseType(caseData.caseType)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-4 h-4" />
                <span>ID: #{caseData._id.slice(-6)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Status Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {(() => {
                const statusInfo = getStatusInfo(caseData.status);
                const IconComponent = statusInfo.icon;
                return (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm border ${statusInfo.color}`}>
                    <IconComponent className="w-4 h-4" />
                    {statusInfo.label}
                  </div>
                );
              })()}
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {caseData.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleCaseAction('accept')} 
                    disabled={updateLoading}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {updateLoading ? 'Processing...' : 'Accept'}
                  </button>
                  <button 
                    onClick={() => handleCaseAction('reject')} 
                    disabled={updateLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {updateLoading ? 'Processing...' : 'Reject'}
                  </button>
                </>
              )}
              {caseData.status !== 'pending' && (
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Update'}
                </button>
              )}
              <button 
                onClick={() => window.print()} 
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Case Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Case Description
            </h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{caseData.description}</p>
          </motion.div>

          {/* Client Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-600 mb-1">Full Name</label>
                  <p className="text-slate-800 font-medium">{caseData.citizen.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-600 mb-1">Email Address</label>
                  <p className="text-slate-800">{caseData.citizen.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-600 mb-1">Phone Number</label>
                  <p className="text-slate-800">{caseData.citizen.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-600 mb-1">Registration Date</label>
                  <p className="text-slate-800">{formatDate(caseData.createdAt)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Case Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Case Timeline
            </h2>
            
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <TimelineItem 
                  key={index}
                  index={index}
                  date={item.date}
                  event={item.event}
                  description={item.description}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Status Update */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50"
            >
              <h3 className="font-semibold text-emerald-800 mb-4">Update Status</h3>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={handleUpdateCase}
                disabled={updateLoading}
                className="w-full mt-4 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 font-medium"
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          )}

          {/* Case Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50"
          >
            <h3 className="font-semibold text-emerald-800 mb-4">Case Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 text-sm">Case Type</span>
                <span className="font-medium text-emerald-800">{formatCaseType(caseData.caseType)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 text-sm">Last Updated</span>
                <span className="font-medium text-emerald-800 text-right text-sm">{formatDate(caseData.updatedAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 text-sm">Current Status</span>
                <span className="font-medium text-emerald-800">{formatStatus(caseData.status)}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6"
          >
            <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors group">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-700">Add Note</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700">Schedule Meeting</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors group">
                <Bell className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-700">Set Reminder</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group">
                <Share2 className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-700">Share Case</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
