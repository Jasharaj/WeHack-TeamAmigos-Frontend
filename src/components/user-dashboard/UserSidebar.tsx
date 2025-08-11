'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Scale, 
  Bell, 
  Bot, 
  Gavel, 
  FileText, 
  User, 
  LogOut,
  Loader2
} from 'lucide-react';
import config from '@/config';

const sidebarLinks = [
  {
    href: '/user-dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/user-dashboard/cases',
    label: 'My Cases',
    icon: Scale,
  },
  {
    href: '/user-dashboard/reminders',
    label: 'Reminders',
    icon: Bell,
  },
  {
    href: '/user-dashboard/assistant',
    label: 'AI Assistant',
    icon: Bot,
  },
  {
    href: '/user-dashboard/disputes',
    label: 'Disputes',
    icon: Gavel,
  },
  {
    href: '/user-dashboard/documents',
    label: 'Documents',
    icon: FileText,
  },
  {
    href: '/user-dashboard/profile',
    label: 'Profile',
    icon: User,
  }
];

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

const UserSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'citizen') {
      router.push('/login');
      return;
    }

    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${config.BASE_URL}/api/v1/citizen/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Check if the response is JSON before parsing
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // If not JSON, handle the error
          const text = await response.text();
          console.error('Non-JSON response received:', text);
          throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
        }

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        setUserProfile(data.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const token = localStorage.getItem('token');
      
      // Call logout API
      const response = await fetch(`${config.BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear storage and redirect even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col relative overflow-hidden shadow-lg">
      {/* Sidebar gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-transparent to-teal-50/30"></div>
      
      {/* Logo */}
      <div className="relative z-10 p-6 border-b border-slate-200">
        <Link href="/user-dashboard" className="flex items-center space-x-3 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200"
          >
            <Scale className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              CasePilot
            </span>
            <div className="text-xs text-slate-500 font-medium">Legal Management</div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="relative z-10 flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-2">
          {sidebarLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    pathname === link.href
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-transparent'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`${
                      pathname === link.href
                        ? 'text-emerald-600'
                        : 'text-slate-500 group-hover:text-emerald-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.div>
                  <span className="font-medium">{link.label}</span>
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 bg-emerald-500 rounded-full ml-auto"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="relative z-10 p-4 border-t border-slate-200">
        <motion.div 
          className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
            whileHover={{ rotate: 10 }}
          >
            {userProfile ? userProfile.name.charAt(0) : ''}
          </motion.div>
          <div className="flex-1">
            {loading ? (
              <div className="space-y-1">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
              </div>
            ) : userProfile ? (
              <>
                <p className="text-sm font-semibold text-slate-800">{userProfile.name}</p>
                <p className="text-xs text-slate-500">{userProfile.email}</p>
              </>
            ) : (
              <p className="text-sm text-slate-500">Error loading profile</p>
            )}
          </div>
        </motion.div>
        
        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          disabled={isLoggingOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 disabled:opacity-50 border border-red-200"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </motion.div>
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default UserSidebar;
