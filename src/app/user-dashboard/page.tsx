'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  FolderOpen, 
  FileEdit, 
  CheckCircle2, 
  Archive, 
  Ban,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  User,
  Clock,
  Gavel,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Eye
} from 'lucide-react';
import config from '@/config';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Case {
  _id: string;
  title: string;
  description: string;
  caseType: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

// StatCard Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  isLoading = false,
  index = 0
}: { 
  title: string; 
  value: number; 
  icon: any; 
  isLoading?: boolean;
  index?: number;
}) => (
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
    className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur p-4 shadow-lg border border-slate-200 hover:border-emerald-300 transition-all duration-300"
  >
    {/* Hover shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-emerald-100/30 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
        {isLoading ? (
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-16" />
        ) : (
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              delay: index * 0.06 + 0.1 
            }}
            className="text-2xl font-bold text-slate-800"
          >
            {value}
          </motion.p>
        )}
      </div>
      
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-emerald-600" />
      </div>
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

// ActionTile Component  
const ActionTile = ({ 
  href, 
  title, 
  icon: Icon,
  isPrimary = false,
  index = 0 
}: { 
  href: string; 
  title: string; 
  icon: any;
  isPrimary?: boolean;
  index?: number;
}) => (
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
    className="group"
  >
    <Link 
      href={href}
      className={`
        block relative overflow-hidden rounded-2xl p-6 shadow-lg border transition-all duration-300
        ${isPrimary 
          ? 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300 hover:border-emerald-400' 
          : 'bg-white/80 backdrop-blur border-slate-200 hover:border-emerald-300'
        }
      `}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isPrimary 
          ? 'bg-gradient-to-br from-emerald-200/30 to-teal-200/30 opacity-100'
          : 'bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100'
      }`} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-2xl flex items-center justify-center
            ${isPrimary 
              ? 'bg-gradient-to-br from-emerald-200 to-teal-200' 
              : 'bg-slate-100 group-hover:bg-emerald-100'
            }
          `}>
            <Icon className={`w-6 h-6 ${isPrimary ? 'text-emerald-700' : 'text-slate-600 group-hover:text-emerald-600'}`} />
          </div>
          <span className={`font-semibold ${isPrimary ? 'text-emerald-800' : 'text-slate-800'}`}>
            {title}
          </span>
        </div>
        
        <motion.div
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 340, damping: 20 }}
        >
          <ChevronRight className={`w-5 h-5 ${isPrimary ? 'text-emerald-700' : 'text-slate-500'}`} />
        </motion.div>
      </div>
    </Link>
  </motion.div>
);

// RecentActivityItem Component
const RecentActivityItem = ({ caseItem, index = 0 }: { caseItem: Case; index?: number }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Clock };
      case 'in progress':
        return { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: TrendingUp };
      case 'resolved':
        return { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 };
      case 'closed':
        return { color: 'bg-slate-500/20 text-slate-300 border-slate-500/30', icon: Archive };
      case 'rejected':
        return { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: Ban };
      default:
        return { color: 'bg-slate-500/20 text-slate-300 border-slate-500/30', icon: FileText };
    }
  };

  const statusInfo = getStatusInfo(caseItem.status);
  const StatusIcon = statusInfo.icon;

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
        scale: 1.01,
        transition: { type: "spring", stiffness: 340, damping: 20, mass: 0.8 }
      }}
      className="group"
    >
      <Link href={`/user-dashboard/cases/${caseItem._id}`} className="block">
        <div className="relative overflow-hidden p-4 bg-white/80 backdrop-blur rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {caseItem.title}
                </h3>
                <span className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                  ${statusInfo.color}
                `}>
                  <StatusIcon className="w-3 h-3" />
                  {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Gavel className="w-4 h-4" />
                  {caseItem.caseType.charAt(0).toUpperCase() + caseItem.caseType.slice(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(caseItem.createdAt)}
                </span>
              </div>
            </div>
            
            <motion.div
              whileHover={{ x: 2 }}
              className="flex items-center gap-2 text-slate-600 group-hover:text-emerald-600 transition-colors"
            >
              <span className="text-sm font-medium">View</span>
              <Eye className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'citizen') {
      router.push('/login');
      return;
    }

    // Fetch user data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch profile
        const profileResponse = await fetch(`${config.BASE_URL}/api/v1/citizen/profile`, {
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
        
        // Fetch cases
        const casesResponse = await fetch(`${config.BASE_URL}/api/v1/cases`, {
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

  // Calculate statistics
  const totalCases = cases.length;
  const pendingCases = cases.filter(c => c.status.toLowerCase() === 'pending').length;
  const inProgressCases = cases.filter(c => c.status.toLowerCase() === 'in progress').length;
  const resolvedCases = cases.filter(c => c.status.toLowerCase() === 'resolved').length;
  const closedCases = cases.filter(c => c.status.toLowerCase() === 'closed').length;
  const rejectedCases = cases.filter(c => c.status.toLowerCase() === 'rejected').length;

  // Get recent cases
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Get current hour for greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-white relative"
    >
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.008]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='17' cy='17' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <p className="font-medium">Error: {error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.24, delay: 0.15 }}
              className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent mb-2"
            >
              Welcome back, {profile?.name?.split(' ')[0] || 'User'}!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.24, delay: 0.2 }}
              className="text-slate-600"
            >
              Here's what's happening with your legal matters
            </motion.p>
          </div>

          {/* User Menu Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.24, delay: 0.25 }}
            className="flex items-center gap-4 mt-4 sm:mt-0"
          >
            <button className="p-2 rounded-2xl bg-white/80 border border-slate-200 hover:border-emerald-300 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-2 rounded-2xl bg-white/80 border border-slate-200 hover:border-emerald-300 transition-colors">
              <Sun className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/80 border border-slate-200 rounded-2xl">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800">{profile?.name || 'User'}</p>
                <p className="text-xs text-slate-500">Citizen</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.24, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-700 text-sm font-medium mb-12"
        >
          <CheckCircle2 className="w-4 h-4" />
          {greeting}
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          <StatCard title="Total Cases" value={totalCases} icon={Scale} isLoading={loading} index={0} />
          <StatCard title="Pending Review" value={pendingCases} icon={Clock} isLoading={loading} index={1} />
          <StatCard title="Active Cases" value={inProgressCases} icon={TrendingUp} isLoading={loading} index={2} />
          <StatCard title="Successfully Resolved" value={resolvedCases} icon={CheckCircle2} isLoading={loading} index={3} />
          <StatCard title="Closed Files" value={closedCases} icon={Archive} isLoading={loading} index={4} />
          <StatCard title="Dismissed" value={rejectedCases} icon={Ban} isLoading={loading} index={5} />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionTile href="/user-dashboard/cases/new" title="File New Case" icon={FileEdit} isPrimary={true} index={0} />
            <ActionTile href="/user-dashboard/cases" title="My Cases" icon={FolderOpen} index={1} />
            <ActionTile href="/user-dashboard/disputes" title="Disputes" icon={Gavel} index={2} />
            <ActionTile href="/user-dashboard/documents" title="Documents" icon={FileText} index={3} />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Recent Activity</h2>
            <motion.button
              whileHover={{ x: 2 }}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Link href="/user-dashboard/cases" className="flex items-center gap-2">
                <span className="text-sm font-medium">View All Cases</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: i * 0.1 }}
                  className="h-20 bg-white/80 rounded-2xl border border-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : cases.length > 0 ? (
            <div className="space-y-4">
              {recentCases.map((caseItem, index) => (
                <RecentActivityItem key={caseItem._id} caseItem={caseItem} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.24 }}
              className="text-center py-16 px-8 bg-white/80 rounded-2xl border border-slate-200 shadow-lg"
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
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center"
              >
                <Scale className="w-12 h-12 text-emerald-600" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-4">Ready to Get Started?</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                You haven't filed any cases yet. Our platform makes it easy to submit and track your legal matters.
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/user-dashboard/cases/new"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FileEdit className="w-5 h-5" />
                  File Your First Case
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
