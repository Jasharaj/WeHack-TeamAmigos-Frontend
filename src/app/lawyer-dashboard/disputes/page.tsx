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
  const [showSettlementForm, setShowSettlementForm] = useState(false);
  const [settlementOffer, setSettlementOffer] = useState({
    amount: '',
    terms: ''
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
      setDisputes(data.data || []);
    } catch (err) {
      console.error('Error fetching disputes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAssignment = async (disputeId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchDisputes(); // Refresh to get updated status
      } else {
        const errorData = await response.json();
        alert(`Error accepting assignment: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error accepting assignment:', err);
    }
  };

  const handleSendMessage = async (disputeId: string) => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to send messages');
        return;
      }

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
      } else {
        const errorData = await response.json();
        alert(`Error sending message: ${errorData.message || 'Failed to send message'}`);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleCreateCase = async (disputeId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/create-case`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Case created successfully! Case ID: ${data.data._id}`);
        fetchDisputes(); // Refresh to get updated dispute
      } else {
        const errorData = await response.json();
        alert(`Error creating case: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error creating case:', err);
    }
  };

  const handleSendSettlementOffer = async (disputeId: string) => {
    if (!settlementOffer.terms.trim()) {
      alert('Please provide settlement terms');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/settlement-offer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: settlementOffer.amount ? parseFloat(settlementOffer.amount) : undefined,
          terms: settlementOffer.terms
        })
      });

      if (response.ok) {
        setSettlementOffer({ amount: '', terms: '' });
        setShowSettlementForm(false);
        fetchDisputes(); // Refresh to get updated settlement offers
        alert('Settlement offer sent successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error sending settlement offer: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error sending settlement offer:', err);
    }
  };

  const handleUpdateDisputeStatus = async (disputeId: string, newStatus: LawyerDispute['status']) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchDisputes(); // Refresh to get updated status
        alert(`Dispute status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        alert(`Error updating status: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error updating dispute status:', err);
    }
  };

  const handleAcceptDispute = async (disputeId: string) => {
    await handleAcceptAssignment(disputeId);
  };

  const handleDeclineDispute = async (disputeId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/disputes/${disputeId}/decline`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchDisputes(); // Refresh to get updated status
      } else {
        const errorData = await response.json();
        alert(`Error declining dispute: ${errorData.message}`);
      }
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

  // Organize disputes into sections
  const pendingDisputes = filteredDisputes.filter(dispute => 
    dispute.assignmentStatus === 'pending-acceptance' || 
    dispute.status === 'pending' ||
    (!dispute.assignmentStatus && dispute.status === 'draft')
  );

  const activeDisputes = filteredDisputes.filter(dispute => 
    dispute.assignmentStatus === 'accepted' || 
    (['assigned', 'mediation', 'negotiation', 'court-prep', 'court-hearing'].includes(dispute.status) && dispute.assignmentStatus !== 'unassigned')
  );

  const availableDisputes = filteredDisputes.filter(dispute => 
    dispute.assignmentStatus === 'unassigned' || 
    (!dispute.assignmentStatus && !['resolved', 'dismissed', 'withdrawn'].includes(dispute.status) && !pendingDisputes.includes(dispute) && !activeDisputes.includes(dispute))
  );


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

        {/* Organized Dispute Sections */}
        <div className="space-y-8">
          {/* Pending Review Section */}
          {pendingDisputes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Pending Review ({pendingDisputes.length})</h2>
                  <p className="text-sm text-slate-600">Cases waiting for your acceptance or decline</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingDisputes.map((dispute, index) => {
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
                      className="bg-amber-50 border border-amber-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer group"
                      onClick={() => setSelectedDispute(dispute)}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-5 w-5 text-amber-700" />
                          <span className="text-sm font-medium text-amber-700">
                            {categoryInfo.label}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
                        {dispute.title}
                      </h3>

                      {/* Client Information */}
                      <div className="bg-white rounded-xl p-4 mb-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-semibold text-amber-900">Client</span>
                        </div>
                        <p className="text-sm text-amber-800 font-medium">{dispute.parties.plaintiff.name}</p>
                        <p className="text-xs text-amber-700">{dispute.parties.plaintiff.contactEmail}</p>
                      </div>

                      {/* Priority */}
                      <div className="mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig[dispute.priority].bg} ${priorityConfig[dispute.priority].color}`}>
                          {dispute.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>

                      {/* Accept/Decline Buttons */}
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
                          Accept Case
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

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-amber-700 pt-3 border-t border-amber-200">
                        <span>{dispute.messages.length} messages</span>
                        <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* My Active Cases Section */}
          {activeDisputes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">My Active Cases ({activeDisputes.length})</h2>
                  <p className="text-sm text-slate-600">Cases you're actively working on</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeDisputes.map((dispute, index) => {
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
                      className="bg-emerald-50 border border-emerald-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer group"
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

                      <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {dispute.title}
                      </h3>

                      {/* Client Information */}
                      <div className="bg-white rounded-xl p-4 mb-4 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-900">Your Client</span>
                        </div>
                        <p className="text-sm text-emerald-800 font-medium">{dispute.parties.plaintiff.name}</p>
                        <p className="text-xs text-emerald-700">{dispute.parties.plaintiff.contactEmail}</p>
                      </div>

                      {/* Next Hearing */}
                      {dispute.nextHearing && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-800 font-medium">
                              Next: {new Date(dispute.nextHearing).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Priority & Status */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig[dispute.priority].bg} ${priorityConfig[dispute.priority].color}`}>
                          {dispute.priority.toUpperCase()} PRIORITY
                        </span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                          ACTIVE CASE
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-emerald-700 pt-3 border-t border-emerald-200">
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
              </div>
            </motion.div>
          )}

          {/* Available Cases Section */}
          {availableDisputes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Available Cases ({availableDisputes.length})</h2>
                  <p className="text-sm text-slate-600">Cases available for assignment</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableDisputes.map((dispute, index) => {
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
                          <CategoryIcon className="h-5 w-5 text-slate-600" />
                          <span className="text-sm font-medium text-slate-600">
                            {categoryInfo.label}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-slate-700 transition-colors">
                        {dispute.title}
                      </h3>

                      {/* Client Information */}
                      <div className="bg-slate-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-slate-600" />
                          <span className="text-sm font-semibold text-slate-700">Client</span>
                        </div>
                        <p className="text-sm text-slate-800 font-medium">{dispute.parties.plaintiff.name}</p>
                        <p className="text-xs text-slate-600">{dispute.parties.plaintiff.contactEmail}</p>
                      </div>

                      {/* Priority */}
                      <div className="mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig[dispute.priority].bg} ${priorityConfig[dispute.priority].color}`}>
                          {dispute.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>

                      {/* Accept Case Button for Available Cases */}
                      <div className="mb-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptDispute(dispute._id);
                          }}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all text-sm flex items-center justify-center gap-2 shadow-lg"
                        >
                          <UserCheck className="w-4 h-4" />
                          Accept This Case
                        </motion.button>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-100">
                        <span>{dispute.messages.length} messages</span>
                        <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredDisputes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
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

          {/* Fallback: Show all disputes if sections are empty */}
          {pendingDisputes.length === 0 && activeDisputes.length === 0 && availableDisputes.length === 0 && filteredDisputes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">All Cases ({filteredDisputes.length})</h2>
                  <p className="text-sm text-slate-600">Cases that need categorization</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                          <CategoryIcon className="h-5 w-5 text-slate-600" />
                          <span className="text-sm font-medium text-slate-600">
                            {categoryInfo.label}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-slate-700 transition-colors">
                        {dispute.title}
                      </h3>

                      {/* Assignment Status Debug */}
                      <div className="mb-3 text-xs text-slate-500">
                        Assignment: {dispute.assignmentStatus || 'undefined'} | Status: {dispute.status}
                      </div>

                      {/* Accept/Decline Buttons - Show for all in fallback */}
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

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-100">
                        <span>{dispute.messages.length} messages</span>
                        <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Comprehensive Dispute Detail Modal with Backend Integration */}
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
                        {selectedDispute.canCreateCase && !selectedDispute.relatedCase && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCreateCase(selectedDispute._id)}
                            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                          >
                            Create Case
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
                        <h3 className="font-semibold text-slate-900 mb-3">Case Description</h3>
                        <p className="text-slate-700 leading-relaxed">{selectedDispute.description}</p>
                      </div>

                      {/* Professional Actions for Lawyers */}
                      {selectedDispute.assignmentStatus === 'accepted' && (
                        <div className="bg-emerald-50 rounded-xl p-6">
                          <h3 className="font-semibold text-emerald-900 mb-4">Professional Actions</h3>
                          <div className="flex gap-3 mb-4 flex-wrap">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowSettlementForm(!showSettlementForm)}
                              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2 shadow-lg"
                            >
                              <DollarSign className="h-4 w-4" />
                              Settlement Offer
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleUpdateDisputeStatus(selectedDispute._id, 'mediation')}
                              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2 shadow-lg"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Start Mediation
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleUpdateDisputeStatus(selectedDispute._id, 'resolved')}
                              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2 shadow-lg"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark Resolved
                            </motion.button>
                          </div>

                          {/* Settlement Form */}
                          <AnimatePresence>
                            {showSettlementForm && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm"
                              >
                                <h4 className="font-medium text-slate-900 mb-4">Settlement Offer</h4>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                      Amount (Optional)
                                    </label>
                                    <input
                                      type="number"
                                      placeholder="Settlement amount"
                                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                                      value={settlementOffer.amount}
                                      onChange={(e) => setSettlementOffer(prev => ({ ...prev, amount: e.target.value }))}
                                    />
                                  </div>
                                  <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                      Terms & Conditions
                                    </label>
                                    <textarea
                                      placeholder="Settlement terms..."
                                      rows={3}
                                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none transition-all"
                                      value={settlementOffer.terms}
                                      onChange={(e) => setSettlementOffer(prev => ({ ...prev, terms: e.target.value }))}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSendSettlementOffer(selectedDispute._id)}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                                  >
                                    Send Offer
                                  </motion.button>
                                  <button 
                                    onClick={() => setShowSettlementForm(false)}
                                    className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-300 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Messages & Communication */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <MessageCircle className="h-5 w-5 text-emerald-600" />
                          Professional Communications ({selectedDispute.messages.length})
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
                            placeholder="Send professional message to client..."
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(selectedDispute._id);
                              }
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSendMessage(selectedDispute._id)}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center"
                            disabled={!newMessage.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Client Information */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h3 className="font-semibold text-slate-900 mb-3">Client Details</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-slate-500">Client</span>
                            <p className="text-slate-900 font-medium">{selectedDispute.parties.plaintiff.name}</p>
                            <p className="text-sm text-slate-600">{selectedDispute.parties.plaintiff.contactEmail}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-500">Opposing Party</span>
                            <p className="text-slate-900 font-medium">{selectedDispute.parties.defendant.name}</p>
                            {selectedDispute.parties.defendant.contactEmail && (
                              <p className="text-sm text-slate-600">{selectedDispute.parties.defendant.contactEmail}</p>
                            )}
                          </div>
                        </div>
                      </div>

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
                        </div>
                      </div>

                      {/* Settlement Offers */}
                      {selectedDispute.settlementOffers.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            Settlement History
                          </h3>
                          <div className="space-y-3">
                            {selectedDispute.settlementOffers.map((offer) => (
                              <div key={offer._id} className="border border-slate-100 rounded-xl p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-medium text-slate-900">{offer.offeredBy.name}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {offer.status}
                                  </span>
                                </div>
                                {offer.amount && (
                                  <p className="font-semibold text-green-600 text-lg">${offer.amount}</p>
                                )}
                                <p className="text-sm text-slate-600 mt-1">{offer.terms}</p>
                                <p className="text-xs text-slate-500 mt-2">
                                  {new Date(offer.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
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
                                  <p className="text-xs text-slate-500">by {doc.uploadedBy.name}</p>
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
                            Upcoming Deadlines
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
