'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config from '@/config';

// Types
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Case {
  _id: string;
  title: string;
  status: string;
  caseType: string;
  createdAt: string;
  updatedAt: string;
  lawyer?: {
    name: string;
  };
}

// Components
const OverviewCard = ({ title, value, icon, isLoading = false }: { title: string; value: string | number; icon: string; isLoading?: boolean }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-start">
      <div className="w-full">
        <p className="text-black text-sm font-medium">{title}</p>
        {isLoading ? (
          <div className="h-8 bg-gray-200 rounded animate-pulse mt-2 w-16"></div>
        ) : (
          <p className="text-2xl font-bold text-black mt-2">{value}</p>
        )}
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

const QuickAction = ({ href, label, icon }: { href: string; label: string; icon: string }) => (
  <Link
    href={href}
    className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
  >
    <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="ml-3 text-black font-medium group-hover:text-green-600 transition-colors">{label}</span>
  </Link>
);

const RecentCaseItem = ({ caseItem }: { caseItem: Case }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/user-dashboard/cases/${caseItem._id}`} className="block">
      <div className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-black">{caseItem.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(caseItem.status)}`}>
              {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
            </span>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-600 gap-4">
            <span>Type: {caseItem.caseType.charAt(0).toUpperCase() + caseItem.caseType.slice(1)}</span>
            <span>Filed: {formatDate(caseItem.createdAt)}</span>
          </div>
        </div>
        <span className="text-gray-400">→</span>
      </div>
    </Link>
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
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await profileResponse.json();
        setProfile(profileData.data);
        
        // Fetch cases
        const casesResponse = await fetch(`${config.BASE_URL}/api/v1/citizen/cases`, {
          headers: {
            'Authorization': `Bearer ${token}`
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

  return (
    <div className="space-y-8">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
          ) : (
            `Welcome back, ${profile?.name?.split(' ')[0] || 'User'}`
          )}
        </h1>
        <p className="text-black mt-1">Here's what's happening with your cases today.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OverviewCard 
          title="Total Cases" 
          value={totalCases} 
          icon="📊" 
          isLoading={loading} 
        />
        <OverviewCard 
          title="Pending Cases" 
          value={pendingCases} 
          icon="⏳" 
          isLoading={loading} 
        />
        <OverviewCard 
          title="In Progress" 
          value={inProgressCases} 
          icon="⚙️" 
          isLoading={loading} 
        />
        <OverviewCard 
          title="Resolved Cases" 
          value={resolvedCases} 
          icon="✅" 
          isLoading={loading} 
        />
        <OverviewCard 
          title="Closed Cases" 
          value={closedCases} 
          icon="🔒" 
          isLoading={loading} 
        />
        <OverviewCard 
          title="Rejected Cases" 
          value={rejectedCases} 
          icon="❌" 
          isLoading={loading} 
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickAction href="/user-dashboard/cases/new" label="Submit New Case" icon="📝" />
          <QuickAction href="/user-dashboard/cases" label="View All Cases" icon="⚖️" />
        </div>
      </div>

      {/* Recent Cases */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-black">Recent Cases</h2>
          <Link href="/user-dashboard/cases" className="text-green-600 hover:text-green-700 text-sm">
            View All →
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            ))}
          </div>
        ) : cases.length > 0 ? (
          <div className="space-y-4">
            {recentCases.map((caseItem) => (
              <RecentCaseItem key={caseItem._id} caseItem={caseItem} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">You haven't filed any cases yet.</p>
            <Link 
              href="/user-dashboard/cases/new" 
              className="mt-3 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Your First Case
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
