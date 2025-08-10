'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  FileEdit, 
  Send, 
  Eye, 
  PlayCircle, 
  CheckCircle2, 
  Archive, 
  Ban, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  ChevronRight,
  Plus,
  Gavel,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';

import config from '@/config';

interface Case {
  _id: string;
  title: string;
  description: string;
  status: string;
  caseType: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

// Status configuration
const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { 
        color: 'bg-amber-50 text-amber-700 border-amber-200', 
        icon: Clock,
        textColor: 'text-amber-700'
      };
    case 'in progress':
      return { 
        color: 'bg-blue-50 text-blue-700 border-blue-200', 
        icon: TrendingUp,
        textColor: 'text-blue-700'
      };
    case 'resolved':
      return { 
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
        icon: CheckCircle2,
        textColor: 'text-emerald-700'
      };
    case 'closed':
      return { 
        color: 'bg-slate-50 text-slate-700 border-slate-200', 
        icon: Archive,
        textColor: 'text-slate-700'
      };
    case 'rejected':
      return { 
        color: 'bg-red-50 text-red-700 border-red-200', 
        icon: Ban,
        textColor: 'text-red-700'
      };
    default:
      return { 
        color: 'bg-slate-50 text-slate-700 border-slate-200', 
        icon: FileEdit,
        textColor: 'text-slate-700'
      };
  }
};

// Components
const StatusBadge = ({ status }: { status: string }) => {
  const statusInfo = getStatusInfo(status);
  const IconComponent = statusInfo.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
      <IconComponent className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}) => (
  <motion.div 
    variants={slideUp}
    initial="initial"
    animate="animate"
    transition={{ delay: 0.1 }}
    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8"
  >
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-colors"
        />
      </div>
      
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-colors"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  </motion.div>
);

const CaseCard = ({ caseItem, index }: { caseItem: Case; index: number }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const statusInfo = getStatusInfo(caseItem.status);

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.06 }}
      whileHover={{ 
        scale: 1.01,
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 20 }
      }}
      whileTap={{ scale: 0.99 }}
      className="group"
    >
      <Link href={`/user-dashboard/cases/${caseItem._id}`} className="block">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
          <div className="flex items-start justify-between mb-4">
            <StatusBadge status={caseItem.status} />
            {caseItem.priority && (
              <div className={`w-2 h-2 rounded-full ${
                caseItem.priority === 'high' ? 'bg-red-400' : 
                caseItem.priority === 'medium' ? 'bg-amber-400' : 'bg-green-400'
              }`} />
            )}
          </div>
          
          <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {caseItem.title}
          </h3>
          
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {caseItem.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Gavel className="w-4 h-4" />
                {caseItem.caseType.charAt(0).toUpperCase() + caseItem.caseType.slice(1)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(caseItem.createdAt)}
              </span>
            </div>
            
            <motion.div
              whileHover={{ x: 2 }}
              className="flex items-center gap-2 text-emerald-600 group-hover:text-emerald-700 transition-colors"
            >
              <span className="font-medium">View</span>
              <Eye className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-center py-16 px-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
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
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mb-6"
      >
        <Scale className="w-8 h-8" />
      </motion.div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-4">No cases found</h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        You haven't filed any cases yet. Our platform makes it easy to submit and track your legal matters.
      </p>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link 
          href="/user-dashboard/cases/new"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          File Your First Case
          <motion.div whileHover={{ x: 2 }}>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  </motion.div>
);

export default function CasesList() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'citizen') {
      router.push('/login');
      return;
    }

    // Fetch cases data
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`${config.BASE_URL}/api/v1/cases`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cases');
        }

        const data = await response.json();
        setCases(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [router]);

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (caseItem.description && caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || caseItem.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex items-center gap-3 text-slate-600">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"
              />
              <span className="text-lg">Loading cases...</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
          variants={slideUp}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Cases</h1>
              <p className="text-slate-600 mt-1">Manage and track your legal cases</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link 
              href="/user-dashboard/cases/new"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl mt-4 sm:mt-0"
            >
              <Plus className="w-4 h-4" />
              File New Case
              <motion.div whileHover={{ x: 2 }}>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="font-medium">Error: {error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Content */}
        <div>
          {cases.length === 0 ? (
            <EmptyState />
          ) : filteredCases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-16 px-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No matching cases</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((caseItem, index) => (
                  <CaseCard key={caseItem._id} caseItem={caseItem} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
