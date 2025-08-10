'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Scale, 
  Eye, 
  ChevronRight,
  Briefcase,
  Timer,
  BookOpen,
  MessageCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import config from '@/config';

// Types
interface LawyerProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
}

interface Case {
  _id: string;
  title: string;
  description?: string;
  caseType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  citizen: {
    name: string;
    email: string;
    phone?: string;
  };
}

// Components
const OverviewCard = ({ 
  title, 
  value, 
  icon, 
  isLoading = false, 
  trend, 
  color = "emerald",
  index = 0 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ComponentType<any>; 
  isLoading?: boolean; 
  trend?: string;
  color?: string;
  index?: number;
}) => {
  const Icon = icon;
  const colorConfig = {
    emerald: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-violet-600',
    amber: 'from-amber-500 to-orange-600'
  }[color] || 'from-emerald-500 to-teal-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.24, 
        delay: index * 0.06,
        type: "spring", 
        stiffness: 240, 
        damping: 24 
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { type: "spring", stiffness: 340, damping: 20, mass: 0.8 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur p-6 shadow-lg border border-slate-200 hover:border-emerald-300 transition-all duration-300"
    >
      {/* Hover shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-emerald-100/30 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorConfig} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
        {isLoading ? (
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-16"></div>
        ) : (
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              delay: index * 0.06 + 0.1 
            }}
            className="text-2xl font-bold text-slate-900"
          >
            {value}
          </motion.p>
        )}
      </div>
      
      {/* Bottom accent line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.6, delay: index * 0.06 + 0.2 }}
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"
      />
    </motion.div>
  );
};

const QuickActionCard = ({ 
  title, 
  description, 
  icon, 
  href,
  index = 0 
}: { 
  title: string; 
  description: string; 
  icon: React.ComponentType<any>; 
  href: string;
  index?: number;
}) => {
  const Icon = icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.24, 
        delay: 0.3 + index * 0.06,
        type: "spring", 
        stiffness: 240, 
        damping: 24 
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { type: "spring", stiffness: 340, damping: 20, mass: 0.8 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Link 
        href={href}
        className="block relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-lg p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
      >
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300">
            <Icon className="w-6 h-6 text-slate-600 group-hover:text-emerald-600 transition-colors" />
          </div>
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 340, damping: 20 }}
          >
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-all duration-300" />
          </motion.div>
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

const RecentCaseItem = ({ caseItem, index = 0 }: { caseItem: Case; index?: number }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock
        };
      case 'in progress':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Eye
        };
      case 'resolved':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2
        };
      case 'closed':
        return {
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: FileText
        };
      case 'rejected':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: AlertTriangle
        };
      default:
        return {
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: FileText
        };
    }
  };

  const statusConfig = getStatusConfig(caseItem.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
    >
      <Link href={`/lawyer-dashboard/cases/${caseItem._id}`} className="block">
        <div className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mr-4 group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300">
            <Scale className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{caseItem.title}</h3>
              <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border font-medium ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3" />
                {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{caseItem.citizen?.name || 'Unknown Client'}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{caseItem.caseType.charAt(0).toUpperCase() + caseItem.caseType.slice(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(caseItem.updatedAt)}</span>
              </div>
            </div>
          </div>
          
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </Link>
    </motion.div>
  );
};

export default function DashboardHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LawyerProfile | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'lawyer') {
      router.push('/login');
      return;
    }

    // Fetch lawyer data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch profile
        const profileResponse = await fetch(`${config.BASE_URL}/api/v1/lawyer/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await profileResponse.json();
        setProfile(profileData.data);
        
        // Fetch assigned cases
        const casesResponse = await fetch(`${config.BASE_URL}/api/v1/lawyer/cases`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!casesResponse.ok) {
          throw new Error('Failed to fetch cases');
        }

        const casesData = await casesResponse.json();
        setCases(casesData.data);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Count cases by status
  const totalCases = cases.length;
  const pendingCases = cases.filter(c => c.status.toLowerCase() === 'pending').length;
  const inProgressCases = cases.filter(c => c.status.toLowerCase() === 'in progress').length;
  const resolvedCases = cases.filter(c => c.status.toLowerCase() === 'resolved').length;
  const closedCases = cases.filter(c => c.status.toLowerCase() === 'closed').length;
  const rejectedCases = cases.filter(c => c.status.toLowerCase() === 'rejected').length;

  // Get most recent cases
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Get pending cases that need action
  const pendingCasesNeedingAction = cases.filter(c => c.status.toLowerCase() === 'pending');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white"
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 border border-red-200 p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Error Loading Dashboard</p>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center lg:text-left"
        >
          {loading ? (
            <div className="space-y-3">
              <div className="h-10 bg-slate-200 rounded-xl animate-pulse w-96 mx-auto lg:mx-0"></div>
              <div className="h-6 bg-slate-200 rounded-lg animate-pulse w-64 mx-auto lg:mx-0"></div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-emerald-600 bg-clip-text text-transparent">
                Welcome back, {profile?.name?.split(' ')[0] || 'Advocate'}!
              </h1>
              <p className="text-slate-600 text-lg mt-2">Here's what's happening with your legal matters</p>
            </>
          )}
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <OverviewCard 
            title="Total Cases" 
            value={totalCases} 
            icon={Scale}
            isLoading={loading} 
            trend="+12% this month"
            color="emerald"
            index={0}
          />
          <OverviewCard 
            title="Pending Cases" 
            value={pendingCases} 
            icon={Clock}
            isLoading={loading}
            color="amber"
            index={1}
          />
          <OverviewCard 
            title="In Progress" 
            value={inProgressCases} 
            icon={Eye}
            isLoading={loading}
            color="blue"
            index={2}
          />
          <OverviewCard 
            title="Resolved Cases" 
            value={resolvedCases} 
            icon={CheckCircle2}
            isLoading={loading}
            trend="+8% this month"
            color="emerald"
            index={3}
          />
          <OverviewCard 
            title="Closed Cases" 
            value={closedCases} 
            icon={FileText}
            isLoading={loading}
            color="purple"
            index={4}
          />
          <OverviewCard 
            title="Rejected Cases" 
            value={rejectedCases} 
            icon={AlertTriangle}
            isLoading={loading}
            color="amber"
            index={5}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <QuickActionCard
              title="View All Cases"
              description="Manage and track all your assigned cases"
              icon={Briefcase}
              href="/lawyer-dashboard/cases"
              index={0}
            />
            <QuickActionCard
              title="Pending Approvals"
              description="Review cases waiting for your acceptance"
              icon={Timer}
              href="/lawyer-dashboard/cases?status=pending"
              index={1}
            />
            <QuickActionCard
              title="AI Assistant"
              description="Get legal research and case insights"
              icon={MessageCircle}
              href="/lawyer-dashboard/assistant"
              index={2}
            />
            <QuickActionCard
              title="Generate Reports"
              description="Create detailed case reports and summaries"
              icon={BarChart3}
              href="/lawyer-dashboard/reports"
              index={3}
            />
            <QuickActionCard
              title="Update Profile"
              description="Manage your professional information"
              icon={Users}
              href="/lawyer-dashboard/profile"
              index={4}
            />
            <QuickActionCard
              title="View Reminders"
              description="Stay on top of important deadlines"
              icon={Calendar}
              href="/lawyer-dashboard/reminders"
              index={5}
            />
          </div>
        </motion.div>

        {/* Cases Needing Action */}
        <AnimatePresence>
          {pendingCasesNeedingAction.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Cases Needing Your Action</h2>
                </div>
                <Link 
                  href="/lawyer-dashboard/cases?status=pending" 
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-xl animate-pulse">
                      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingCasesNeedingAction.slice(0, 3).map((caseItem, index) => (
                    <RecentCaseItem key={caseItem._id} caseItem={caseItem} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            </div>
            <Link 
              href="/lawyer-dashboard/cases" 
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              View All Cases
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-xl animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : cases.length > 0 ? (
            <div className="space-y-3">
              {recentCases.map((caseItem, index) => (
                <RecentCaseItem key={caseItem._id} caseItem={caseItem} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
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
                className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6"
              >
                <BookOpen className="w-10 h-10 text-slate-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">No Cases Assigned Yet</h3>
              <p className="text-slate-600 mb-8">You don't have any assigned cases at the moment. New cases will appear here when they're assigned to you.</p>
              <Link href="/lawyer-dashboard/cases">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Scale className="w-5 h-5" />
                  Browse Available Cases
                </motion.button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
