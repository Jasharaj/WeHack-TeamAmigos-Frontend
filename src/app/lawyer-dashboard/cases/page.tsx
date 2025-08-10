'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Scale, 
  User, 
  Calendar, 
  Clock, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ChevronRight,
  Users,
  AlertCircle
} from 'lucide-react';
import config from '@/config';

interface Case {
  _id: string;
  title: string;
  description?: string;
  caseType: string;
  status: string;
  citizen: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

const statusConfig = {
  'pending': {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock
  },
  'in progress': {
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Eye
  },
  'resolved': {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2
  },
  'closed': {
    color: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: FileText
  },
  'rejected': {
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertTriangle
  }
};

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${config.BASE_URL}/api/v1/cases`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cases');
        }

        const data = await response.json();
        setCases(data.data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [router]);

  const handleCaseAction = async (caseId: string, action: 'accept' | 'reject') => {
    try {
      console.log('Handling case action:', { caseId, action });
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/cases/${caseId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to update case');
      }

      const result = await response.json();
      console.log('Success result:', result);

      // Update the local state to reflect the change
      const updatedCases = cases.map(c => 
        c._id === caseId 
          ? { ...c, status: action === 'accept' ? 'in progress' : 'rejected' } 
          : c
      );
      
      setCases(updatedCases);
    } catch (err: any) {
      console.error('Error in handleCaseAction:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = 
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (caseItem.citizen?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      caseItem._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    const matchesType = typeFilter === 'all' || caseItem.caseType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

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
            <p className="text-lg font-semibold">Loading cases...</p>
            <p className="text-sm text-slate-500">Please wait while we fetch your assigned cases</p>
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
          <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to Load Cases</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </motion.button>
        </div>
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
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Case Management</h1>
              <p className="text-slate-600">Review and manage your assigned cases</p>
            </div>
          </div>
          <div className="text-sm text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200">
            {filteredCases.length} of {cases.length} cases
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search cases by title, client, or ID..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Type Filter */}
            <select
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="civil">Civil</option>
              <option value="criminal">Criminal</option>
              <option value="family">Family</option>
              <option value="property">Property</option>
              <option value="consumer">Consumer</option>
              <option value="others">Others</option>
            </select>
          </div>
        </motion.div>

        {/* Cases Grid */}
        <AnimatePresence>
          {filteredCases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
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
                className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6"
              >
                <Scale className="w-12 h-12 text-slate-400" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-4">No cases found</h3>
              <p className="text-slate-600 mb-8">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'No cases match your current filters.' 
                  : 'You don\'t have any assigned cases yet.'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCases.map((caseItem, index) => {
                const statusInfo = statusConfig[caseItem.status as keyof typeof statusConfig] || statusConfig['closed'];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.div
                    key={caseItem._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.01,
                      transition: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    className={`bg-white rounded-2xl border border-slate-200 shadow-lg p-6 hover:border-emerald-200 transition-all duration-200 ${
                      caseItem.status === 'pending' ? 'ring-2 ring-amber-100 bg-amber-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                          <Scale className="w-6 h-6 text-slate-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-900 truncate">{caseItem.title}</h3>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">#{caseItem._id.slice(-8)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{caseItem.citizen?.name || 'Unknown Client'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{caseItem.caseType.charAt(0).toUpperCase() + caseItem.caseType.slice(1)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(caseItem.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {caseItem.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCaseAction(caseItem._id, 'accept')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              Accept
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCaseAction(caseItem._id, 'reject')}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              Reject
                            </motion.button>
                          </>
                        )}
                        
                        <Link href={`/lawyer-dashboard/cases/${caseItem._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
