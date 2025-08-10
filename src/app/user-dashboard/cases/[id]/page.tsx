'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Users
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

export default function CaseDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        description: 'Your case is being actively worked on'
      });
    }

    if (caseItem.status === 'resolved') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Resolved',
        description: 'Your case has been successfully resolved'
      });
    }

    if (caseItem.status === 'closed') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Closed',
        description: 'This case has been closed'
      });
    }

    return timeline;
  };

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

  // Get appropriate status color and icon
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

  // Get appropriate status color (legacy support)
  const getStatusColor = (status: string): string => {
    const statusInfo = getStatusInfo(status);
    return statusInfo.color.replace('border-', '').replace(' border-amber-200', '').replace(' border-blue-200', '').replace(' border-green-200', '').replace(' border-slate-200', '').replace(' border-red-200', '');
  };

  // Format case type for display
  const formatCaseType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'citizen') {
      router.push('/login');
      return;
    }

    // Fetch case data
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`${config.BASE_URL}/api/v1/cases/${resolvedParams.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch case details');
        }

        const data = await response.json();
        setCaseData(data.data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [resolvedParams.id, router]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex justify-center items-center"
      >
        <div className="flex items-center gap-4 text-slate-600">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full"
          />
          <div>
            <p className="text-lg font-semibold">Loading case details...</p>
            <p className="text-sm text-slate-500">Please wait while we fetch your case information</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex justify-center items-center p-6"
      >
        <div className="bg-white rounded-2xl border border-red-200 shadow-xl p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <AlertCircle className="w-8 h-8 text-red-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to Load Case</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try Again
            </motion.button>
            <Link href="/user-dashboard/cases">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200"
              >
                Back to Cases
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!caseData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex justify-center items-center p-6"
      >
        <div className="bg-white rounded-2xl border border-amber-200 shadow-xl p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FileText className="w-8 h-8 text-amber-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Case Not Found</h3>
          <p className="text-slate-600 mb-6">The case you're looking for could not be found or may have been moved.</p>
          <Link href="/user-dashboard/cases">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Back to Cases
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const timeline = generateTimeline(caseData);
  const statusInfo = getStatusInfo(caseData.status);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white"
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header with navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <Link 
            href="/user-dashboard/cases" 
            className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            My Cases
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-700 font-medium">Case Details</span>
        </motion.div>

        {/* Case Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{caseData.title}</h1>
                  <p className="text-slate-600">Case ID: <span className="font-mono text-slate-800">#{caseData._id.slice(-8)}</span></p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border ${statusInfo.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusInfo.label}
                </span>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                  <FileText className="w-4 h-4" />
                  <span>{formatCaseType(caseData.caseType)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  <span>Filed {formatDate(caseData.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()} 
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-200"
              >
                <Printer className="w-5 h-5" />
                Print Details
              </motion.button>
              <Link href={`/user-dashboard/cases/${caseData._id}/update`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
                >
                  <Edit className="w-5 h-5" />
                  Update Case
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Case Description and Timeline */}
          <div className="xl:col-span-2 space-y-6">
            {/* Case Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Case Description</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{caseData.description}</p>
              </div>
            </motion.div>

            {/* Case Timeline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Case Timeline</h2>
              </div>
              
              {timeline.length > 0 ? (
                <div className="space-y-2">
                  {timeline.map((item, index) => (
                    <TimelineItem key={index} index={index} {...item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4"
                  >
                    <Clock className="w-8 h-8 text-slate-400" />
                  </motion.div>
                  <p className="text-slate-500 italic">No timeline events available</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Lawyer Info and Case Status */}
          <div className="space-y-6">
            {/* Assigned Lawyer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Assigned Lawyer</h2>
              </div>
              
              {caseData.lawyer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {caseData.lawyer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{caseData.lawyer.name}</p>
                      <p className="text-sm text-slate-600">Legal Counsel</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">Email:</span>
                      <span className="text-sm text-slate-600">{caseData.lawyer.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">Phone:</span>
                      <span className="text-sm text-slate-600">{caseData.lawyer.phone}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4"
                  >
                    <Users className="w-8 h-8 text-slate-400" />
                  </motion.div>
                  <p className="text-slate-600 font-medium mb-2">No Lawyer Assigned</p>
                  <p className="text-sm text-slate-500">A qualified lawyer will be assigned to your case soon.</p>
                </div>
              )}
            </motion.div>

            {/* Case Status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                  <StatusIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Case Status</h2>
              </div>
              
              <div className={`p-6 rounded-xl border ${statusInfo.color}`}>
                <div className="flex items-center gap-3 mb-3">
                  <StatusIcon className="w-6 h-6" />
                  <h3 className="font-bold text-lg">{statusInfo.label}</h3>
                </div>
                <p className="text-sm mb-4">
                  {caseData.status === 'pending' && 'Your case is awaiting review by our legal team. We will assign a qualified lawyer soon.'}
                  {caseData.status === 'in progress' && 'Your case is being actively worked on by your assigned lawyer. Stay tuned for updates.'}
                  {caseData.status === 'resolved' && 'Congratulations! Your case has been successfully resolved in your favor.'}
                  {caseData.status === 'closed' && 'This case has been closed and is no longer active. All proceedings have been completed.'}
                  {caseData.status === 'rejected' && 'Unfortunately, your case has been rejected after careful review by our legal team.'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                  <Clock className="w-3 h-3" />
                  <span>Last updated: {formatDate(caseData.updatedAt)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
