'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Calendar,
  FileText,
  X,
  Building,
  Home,
  Heart,
  Briefcase,
  Gavel,
  ArrowRight,
  Send,
  Upload,
  User,
  Mail,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  UserX,
  Paperclip,
  Phone,
  MapPin,
  Award
} from 'lucide-react';
import config from '@/config';

// Enhanced Dispute Interface for Lawyers
interface LawyerDispute {
  _id: string;
  title: string;
  description: string;
  
  parties: {
    plaintiff: {
      id: string;
      name: string;
      type: 'Citizen' | 'Lawyer';
      contactEmail: string;
    };
    defendant: {
      id?: string;
      name: string;
      type?: 'Citizen' | 'Lawyer' | 'External';
      contactEmail?: string;
    };
  };
  
  status: 'draft' | 'pending' | 'assigned' | 'mediation' | 'negotiation' | 'court-prep' | 'court-hearing' | 'resolved' | 'dismissed' | 'withdrawn';
  category: 'civil' | 'criminal' | 'corporate' | 'family' | 'property' | 'contract' | 'employment' | 'intellectual-property';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  assignedLawyer?: {
    _id: string;
    name: string;
    email: string;
    specialization: string;
  };
  
  assignmentStatus: 'unassigned' | 'pending-acceptance' | 'accepted' | 'declined';
  relatedCase?: string;
  canCreateCase: boolean;
  
  nextHearing?: string;
  hearingLocation?: string;
  hearingType?: 'mediation' | 'arbitration' | 'court-hearing' | 'settlement-meeting';
  
  messages: Array<{
    _id: string;
    content: string;
    sender: {
      _id: string;
      name: string;
    };
    messageType: 'message' | 'status-update' | 'document-shared' | 'hearing-scheduled' | 'settlement-offer';
    createdAt: string;
  }>;
  
  settlementOffers: Array<{
    _id: string;
    offeredBy: { name: string };
    amount?: number;
    terms: string;
    status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
    createdAt: string;
  }>;
  
  documents: Array<{
    id: string;
    title: string;
    type: 'evidence' | 'contract' | 'correspondence' | 'legal-brief' | 'settlement-offer' | 'other';
    uploadedBy: { name: string };
    shared: boolean;
    uploadedAt: string;
  }>;
  
  deadlines: Array<{
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'completed' | 'overdue';
  }>;
  
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Draft' },
  pending: { color: 'bg-amber-100 text-amber-800', icon: Clock, label: 'Pending Assignment' },
  assigned: { color: 'bg-emerald-100 text-emerald-800', icon: Users, label: 'Assigned to You' },
  mediation: { color: 'bg-purple-100 text-purple-800', icon: MessageCircle, label: 'In Mediation' },
  negotiation: { color: 'bg-teal-100 text-teal-800', icon: MessageCircle, label: 'Negotiating' },
  'court-prep': { color: 'bg-orange-100 text-orange-800', icon: Gavel, label: 'Court Prep' },
  'court-hearing': { color: 'bg-red-100 text-red-800', icon: Scale, label: 'Court Hearing' },
  resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Resolved' },
  dismissed: { color: 'bg-slate-100 text-slate-800', icon: X, label: 'Dismissed' },
  withdrawn: { color: 'bg-gray-100 text-gray-800', icon: ArrowRight, label: 'Withdrawn' }
};

const categoryIcons = {
  civil: { icon: Scale, label: 'Civil Law' },
  criminal: { icon: Gavel, label: 'Criminal Law' },
  corporate: { icon: Building, label: 'Corporate Law' },
  family: { icon: Heart, label: 'Family Law' },
  property: { icon: Home, label: 'Property Law' },
  contract: { icon: FileText, label: 'Contract Law' },
  employment: { icon: Briefcase, label: 'Employment Law' },
  'intellectual-property': { icon: Award, label: 'IP Law' }
};

const priorityConfig = {
  low: { color: 'text-gray-600', bg: 'bg-gray-100' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-100' },
  high: { color: 'text-orange-600', bg: 'bg-orange-100' },
  urgent: { color: 'text-red-600', bg: 'bg-red-100' }
};

export default function LawyerDisputesPage() {
  const [disputes, setDisputes] = useState<LawyerDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<LawyerDispute | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssignment, setFilterAssignment] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/lawyer`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch disputes');
      }

      const data = await response.json();
      console.log('Fetched lawyer disputes:', data);
      setDisputes(data.data || []);
    } catch (err) {
      console.error('Error fetching disputes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDispute = async (disputeId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to accept dispute');
      }

      // Refresh disputes
      fetchDisputes();
    } catch (err) {
      console.error('Error accepting dispute:', err);
      alert('Failed to accept dispute');
    }
  };

  const handleDeclineDispute = async (disputeId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/decline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to decline dispute');
      }

      // Refresh disputes
      fetchDisputes();
    } catch (err) {
      console.error('Error declining dispute:', err);
      alert('Failed to decline dispute');
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.parties.plaintiff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.parties.defendant.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || dispute.status === filterStatus;
    
    const matchesAssignment = filterAssignment === 'all' || 
                             (filterAssignment === 'assigned' && dispute.assignmentStatus === 'accepted') ||
                             (filterAssignment === 'pending' && dispute.assignmentStatus === 'pending-acceptance') ||
                             (filterAssignment === 'unassigned' && dispute.assignmentStatus === 'unassigned');
    
    return matchesSearch && matchesStatus && matchesAssignment;
  });

  const getStatusInfo = (status: LawyerDispute['status']) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const getCategoryInfo = (category: LawyerDispute['category']) => {
    return categoryIcons[category] || categoryIcons.civil;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
          />
          <span className="text-lg text-slate-600">Loading legal disputes...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30"
          style={{
            backgroundSize: '400% 400%',
          }}
        />
        
        {/* Professional floating elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Professional Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Scale className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Legal Disputes Management
              </h1>
              <p className="text-slate-600">Professional dispute resolution and client case management</p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Professional Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{disputes.length}</p>
                <p className="text-sm text-slate-600">Total Cases</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {disputes.filter(d => d.assignmentStatus === 'pending-acceptance').length}
                </p>
                <p className="text-sm text-slate-600">Pending Review</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {disputes.filter(d => d.assignmentStatus === 'accepted').length}
                </p>
                <p className="text-sm text-slate-600">Active Cases</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {disputes.filter(d => d.status === 'mediation' || d.status === 'negotiation').length}
                </p>
                <p className="text-sm text-slate-600">In Progress</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {disputes.filter(d => d.status === 'resolved').length}
                </p>
                <p className="text-sm text-slate-600">Resolved</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Professional Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by case title, client, or defendant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="mediation">Mediation</option>
              <option value="negotiation">Negotiation</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={filterAssignment}
              onChange={(e) => setFilterAssignment(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
            >
              <option value="all">All Assignments</option>
              <option value="pending">Pending Review</option>
              <option value="assigned">My Cases</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </motion.div>

        {/* Professional Disputes Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredDisputes.map((dispute, index) => {
            const statusInfo = getStatusInfo(dispute.status);
            const categoryInfo = getCategoryInfo(dispute.category);
            const StatusIcon = statusInfo.icon;
            const CategoryIcon = categoryInfo.icon;

            return (
              <motion.div
                key={dispute._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedDispute(dispute)}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Professional Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-600">
                      {categoryInfo.label}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </div>
                </div>

                {/* Case Title */}
                <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                  {dispute.title}
                </h3>

                {/* Client Information */}
                <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-900">Client</span>
                  </div>
                  <p className="text-sm text-emerald-800 font-medium">{dispute.parties.plaintiff.name}</p>
                  <p className="text-xs text-emerald-700">{dispute.parties.plaintiff.contactEmail}</p>
                </div>

                {/* Priority & Assignment Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${priorityConfig[dispute.priority].bg} ${priorityConfig[dispute.priority].color}`}>
                    {dispute.priority.toUpperCase()} PRIORITY
                  </span>
                  
                  {dispute.assignmentStatus === 'pending-acceptance' && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-medium">
                      PENDING REVIEW
                    </span>
                  )}
                  
                  {dispute.assignmentStatus === 'accepted' && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-medium">
                      ASSIGNED
                    </span>
                  )}
                </div>

                {/* Action Buttons for Pending Cases */}
                {dispute.assignmentStatus === 'pending-acceptance' && (
                  <div className="flex gap-2 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptDispute(dispute._id);
                      }}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all text-sm flex items-center justify-center gap-1 shadow-lg"
                    >
                      <UserCheck className="w-4 h-4" />
                      Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeclineDispute(dispute._id);
                      }}
                      className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center justify-center gap-1"
                    >
                      <UserX className="w-4 h-4" />
                      Decline
                    </motion.button>
                  </div>
                )}

                {/* Case Activity Footer */}
                <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {dispute.messages.length}
                    </span>
                    {dispute.documents.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {dispute.documents.length}
                      </span>
                    )}
                    {dispute.nextHearing && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-emerald-600 font-medium">Hearing</span>
                      </span>
                    )}
                  </div>
                  <span>{new Date(dispute.lastActivity).toLocaleDateString()}</span>
                </div>
              </motion.div>
            );
          })}

          {/* Professional Empty State */}
          {filteredDisputes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Scale className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No disputes found</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery || filterStatus !== 'all' || filterAssignment !== 'all'
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No disputes assigned to you at this time.'
                }
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
