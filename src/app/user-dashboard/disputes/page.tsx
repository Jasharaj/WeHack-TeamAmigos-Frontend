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
  MapPin
} from 'lucide-react';
import config from '@/config';

// Enhanced Dispute Interface matching the backend
interface EnhancedDispute {
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

// Form interface for creating disputes
interface DisputeFormData {
  title: string;
  description: string;
  defendantName: string;
  defendantEmail?: string;
  category: 'civil' | 'criminal' | 'corporate' | 'family' | 'property' | 'contract' | 'employment' | 'intellectual-property';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  canCreateCase: boolean;
}

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Draft' },
  pending: { color: 'bg-amber-100 text-amber-800', icon: Clock, label: 'Pending Assignment' },
  assigned: { color: 'bg-blue-100 text-blue-800', icon: Users, label: 'Lawyer Assigned' },
  mediation: { color: 'bg-purple-100 text-purple-800', icon: MessageCircle, label: 'In Mediation' },
  negotiation: { color: 'bg-indigo-100 text-indigo-800', icon: MessageCircle, label: 'Negotiating' },
  'court-prep': { color: 'bg-orange-100 text-orange-800', icon: Gavel, label: 'Court Prep' },
  'court-hearing': { color: 'bg-red-100 text-red-800', icon: Scale, label: 'Court Hearing' },
  resolved: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2, label: 'Resolved' },
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
  'intellectual-property': { icon: FileText, label: 'IP Law' }
};

export default function IntegratedDisputesPage() {
  const [disputes, setDisputes] = useState<EnhancedDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<EnhancedDispute | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState<DisputeFormData>({
    title: '',
    description: '',
    defendantName: '',
    defendantEmail: '',
    category: 'civil',
    priority: 'medium',
    canCreateCase: false
  });

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

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch disputes');
      }

      const data = await response.json();
      console.log('Fetched disputes:', data);
      setDisputes(data.data || []);
    } catch (err) {
      console.error('Error fetching disputes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (disputeId: string) => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newMessage })
      });

      if (response.ok) {
        setNewMessage('');
        fetchDisputes(); // Refresh to get updated messages
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleWithdrawDispute = async (disputeId: string) => {
    if (!confirm('Are you sure you want to withdraw this dispute?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/withdraw`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchDisputes(); // Refresh to get updated status
        alert('Dispute withdrawn successfully');
        setSelectedDispute(null);
      } else {
        const errorData = await response.json();
        alert(`Error withdrawing dispute: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error withdrawing dispute:', err);
    }
  };

  const handleAcceptSettlement = async (disputeId: string, offerId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/settlement-offers/${offerId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchDisputes(); // Refresh to get updated settlement status
        alert('Settlement offer accepted!');
      } else {
        const errorData = await response.json();
        alert(`Error accepting settlement: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error accepting settlement:', err);
    }
  };

  const handleRejectSettlement = async (disputeId: string, offerId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/settlement-offers/${offerId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchDisputes(); // Refresh to get updated settlement status
        alert('Settlement offer rejected');
      } else {
        const errorData = await response.json();
        alert(`Error rejecting settlement: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error rejecting settlement:', err);
    }
  };

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const disputeData = {
        title: formData.title,
        description: formData.description,
        defendant: {
          name: formData.defendantName,
          contactEmail: formData.defendantEmail || '',
          type: 'External'
        },
        category: formData.category,
        priority: formData.priority,
        canCreateCase: formData.canCreateCase
      };

      console.log('Creating dispute with data:', disputeData);

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(disputeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create dispute');
      }

      const data = await response.json();
      console.log('Created dispute:', data);
      
      // Reset form and refresh disputes
      setFormData({
        title: '',
        description: '',
        defendantName: '',
        defendantEmail: '',
        category: 'civil',
        priority: 'medium',
        canCreateCase: false
      });
      setShowAddForm(false);
      fetchDisputes();
      
    } catch (err) {
      console.error('Error creating dispute:', err);
      alert(`Error creating dispute: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.parties.plaintiff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.parties.defendant.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || dispute.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusInfo = (status: EnhancedDispute['status']) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const getCategoryInfo = (category: EnhancedDispute['category']) => {
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
          <span className="text-lg text-slate-600">Loading your disputes...</span>
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
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Scale className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Dispute Management
              </h1>
              <p className="text-slate-600">Track and manage your legal disputes with collaborative tools</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            New Dispute
          </motion.button>
        </motion.div>

        {/* Enhanced Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
                <p className="text-sm text-slate-600">Total Disputes</p>
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
                  {disputes.filter(d => d.status === 'pending').length}
                </p>
                <p className="text-sm text-slate-600">Pending</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {disputes.filter(d => d.assignedLawyer).length}
                </p>
                <p className="text-sm text-slate-600">Assigned</p>
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

        {/* Filters */}
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
                placeholder="Search disputes by title, plaintiff, or defendant..."
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
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </motion.div>

        {/* Disputes Grid */}
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
                {/* Header */}
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

                {/* Title */}
                <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                  {dispute.title}
                </h3>

                {/* Parties */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">Plaintiff:</span>
                    <span>{dispute.parties.plaintiff.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="h-4 w-4 text-teal-500" />
                    <span className="font-medium">Defendant:</span>
                    <span>{dispute.parties.defendant.name}</span>
                  </div>
                </div>

                {/* Lawyer Assignment */}
                {dispute.assignedLawyer && (
                  <div className="bg-emerald-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-900">
                        Assigned: {dispute.assignedLawyer.name}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-1">
                      {dispute.assignedLawyer.specialization}
                    </p>
                  </div>
                )}

                {/* Activity Footer */}
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
                  </div>
                  <span>{new Date(dispute.lastActivity).toLocaleDateString()}</span>
                </div>
              </motion.div>
            );
          })}

          {/* Empty state if no disputes */}
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
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Create your first dispute to get started.'
                }
              </p>
              {(!searchQuery && filterStatus === 'all') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Create First Dispute
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Create Dispute Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                {/* Gradient header */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Create New Dispute</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </motion.button>
                </div>

                <form onSubmit={handleCreateDispute} className="p-6 space-y-6">
                  {/* Dispute Title */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Dispute Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter a clear, descriptive title for your dispute"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Provide detailed information about the dispute"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 resize-none transition-all duration-200"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  {/* Defendant Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Defendant Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Full name of defendant"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                        value={formData.defendantName}
                        onChange={(e) => setFormData(prev => ({ ...prev, defendantName: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Defendant Email
                      </label>
                      <input
                        type="email"
                        placeholder="defendant@example.com (optional)"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                        value={formData.defendantEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, defendantEmail: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Category & Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Category
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      >
                        <option value="civil">Civil Law</option>
                        <option value="criminal">Criminal Law</option>
                        <option value="corporate">Corporate Law</option>
                        <option value="family">Family Law</option>
                        <option value="property">Property Law</option>
                        <option value="contract">Contract Law</option>
                        <option value="employment">Employment Law</option>
                        <option value="intellectual-property">Intellectual Property</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Priority Level
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Case Creation Option */}
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="canCreateCase"
                        checked={formData.canCreateCase}
                        onChange={(e) => setFormData(prev => ({ ...prev, canCreateCase: e.target.checked }))}
                        className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <div>
                        <label htmlFor="canCreateCase" className="text-sm font-semibold text-emerald-900 cursor-pointer">
                          Allow case creation from this dispute
                        </label>
                        <p className="text-xs text-emerald-700 mt-1">
                          This allows lawyers to convert this dispute into a formal legal case if needed.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg transition-all duration-200"
                    >
                      Create Dispute
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comprehensive Dispute Detail Modal for Citizens */}
        <AnimatePresence>
          {selectedDispute && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setSelectedDispute(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl relative overflow-hidden max-h-[95vh] overflow-y-auto"
              >
                {/* Gradient header */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {selectedDispute.title}
                      </h2>
                      <div className="flex items-center gap-4">
                        {(() => {
                          const statusInfo = getStatusInfo(selectedDispute.status);
                          const StatusIcon = statusInfo.icon;
                          return (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusInfo.color}`}>
                              <StatusIcon className="h-4 w-4" />
                              {statusInfo.label}
                            </div>
                          );
                        })()}
                        <span className="text-sm text-slate-500">
                          Priority: {selectedDispute.priority}
                        </span>
                        {selectedDispute.status !== 'resolved' && selectedDispute.status !== 'withdrawn' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleWithdrawDispute(selectedDispute._id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                          >
                            Withdraw Dispute
                          </motion.button>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDispute(null)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-slate-500" />
                    </motion.button>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Description */}
                      <div className="bg-slate-50 rounded-xl p-6">
                        <h3 className="font-semibold text-slate-900 mb-3">Dispute Description</h3>
                        <p className="text-slate-700 leading-relaxed">{selectedDispute.description}</p>
                      </div>

                      {/* Settlement Offers - Citizen View */}
                      {selectedDispute.settlementOffers.length > 0 && (
                        <div className="bg-green-50 rounded-xl p-6">
                          <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Settlement Offers
                          </h3>
                          <div className="space-y-4">
                            {selectedDispute.settlementOffers
                              .filter(offer => offer.status === 'pending')
                              .map((offer) => (
                              <motion.div 
                                key={offer._id} 
                                className="bg-white border border-green-200 rounded-xl p-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-medium text-slate-900">Settlement from {offer.offeredBy.name}</p>
                                    {offer.amount && (
                                      <p className="text-2xl font-bold text-green-600">${offer.amount}</p>
                                    )}
                                  </div>
                                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                    Pending Response
                                  </span>
                                </div>
                                <p className="text-slate-700 mb-4">{offer.terms}</p>
                                <div className="flex gap-3">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAcceptSettlement(selectedDispute._id, offer._id)}
                                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                                  >
                                    Accept Offer
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRejectSettlement(selectedDispute._id, offer._id)}
                                    className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-300 transition-colors"
                                  >
                                    Reject
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Messages & Communication */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <MessageCircle className="h-5 w-5 text-emerald-600" />
                          Communications ({selectedDispute.messages.length})
                        </h3>
                        
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                          {selectedDispute.messages.map((message) => (
                            <motion.div 
                              key={message._id} 
                              className="bg-slate-50 border border-slate-100 rounded-xl p-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-slate-900">
                                  {message.sender.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {new Date(message.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-slate-700 leading-relaxed">{message.content}</p>
                              {message.messageType !== 'message' && (
                                <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                                  {message.messageType.replace('-', ' ').toUpperCase()}
                                </span>
                              )}
                            </motion.div>
                          ))}
                        </div>

                        {/* Send Message */}
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Send message to your lawyer..."
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedDispute._id)}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSendMessage(selectedDispute._id)}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                          >
                            <Send className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Case Information */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h3 className="font-semibold text-slate-900 mb-3">Case Details</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-slate-500">You (Plaintiff)</span>
                            <p className="text-slate-900 font-medium">{selectedDispute.parties.plaintiff.name}</p>
                            <p className="text-sm text-slate-600">{selectedDispute.parties.plaintiff.contactEmail}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-500">Defendant</span>
                            <p className="text-slate-900 font-medium">{selectedDispute.parties.defendant.name}</p>
                            {selectedDispute.parties.defendant.contactEmail && (
                              <p className="text-sm text-slate-600">{selectedDispute.parties.defendant.contactEmail}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Lawyer Assignment */}
                      {selectedDispute.assignedLawyer ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                          <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Your Lawyer
                          </h3>
                          <div>
                            <p className="font-medium text-emerald-900">{selectedDispute.assignedLawyer.name}</p>
                            <p className="text-sm text-emerald-700">{selectedDispute.assignedLawyer.email}</p>
                            <p className="text-sm text-emerald-600 mt-1">
                              Specialization: {selectedDispute.assignedLawyer.specialization}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <h3 className="font-semibold text-amber-900 mb-2">Awaiting Lawyer Assignment</h3>
                          <p className="text-sm text-amber-700">
                            Your dispute is pending lawyer assignment. You'll be notified once a lawyer accepts your case.
                          </p>
                        </div>
                      )}

                      {/* Case Progress */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h3 className="font-semibold text-slate-900 mb-3">Case Progress</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Status:</span>
                            <span className="font-medium text-slate-900">{selectedDispute.status.replace('-', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Category:</span>
                            <span className="font-medium text-slate-900">{getCategoryInfo(selectedDispute.category).label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Priority:</span>
                            <span className={`font-medium ${
                              selectedDispute.priority === 'urgent' ? 'text-red-600' :
                              selectedDispute.priority === 'high' ? 'text-orange-600' :
                              selectedDispute.priority === 'medium' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`}>
                              {selectedDispute.priority.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Created:</span>
                            <span className="font-medium text-slate-900">
                              {new Date(selectedDispute.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Next Hearing */}
                      {selectedDispute.nextHearing && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Next Hearing
                          </h3>
                          <div className="space-y-2">
                            <p className="font-medium text-blue-900">
                              {new Date(selectedDispute.nextHearing).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-blue-800">
                              {new Date(selectedDispute.nextHearing).toLocaleTimeString()}
                            </p>
                            {selectedDispute.hearingLocation && (
                              <p className="text-sm text-blue-700">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {selectedDispute.hearingLocation}
                              </p>
                            )}
                            {selectedDispute.hearingType && (
                              <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                                {selectedDispute.hearingType.replace('-', ' ').toUpperCase()}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Documents */}
                      {selectedDispute.documents.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-emerald-600" />
                            Case Documents
                          </h3>
                          <div className="space-y-2">
                            {selectedDispute.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div>
                                  <p className="font-medium text-sm text-slate-900">{doc.title}</p>
                                  <p className="text-xs text-slate-500">
                                    by {doc.uploadedBy.name} • {new Date(doc.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                  doc.shared ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {doc.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Deadlines */}
                      {selectedDispute.deadlines.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            Important Deadlines
                          </h3>
                          <div className="space-y-2">
                            {selectedDispute.deadlines.map((deadline) => (
                              <div key={deadline._id} className="border-l-4 border-orange-400 pl-3 py-2 bg-orange-50 rounded-r-xl">
                                <p className="font-medium text-sm text-slate-900">{deadline.title}</p>
                                <p className="text-xs text-slate-600">{deadline.description}</p>
                                <p className="text-xs text-orange-600 font-medium mt-1">
                                  Due: {new Date(deadline.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
