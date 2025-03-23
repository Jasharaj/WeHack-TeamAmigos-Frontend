'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'in progress': 'bg-green-100 text-green-800',
  'resolved': 'bg-blue-100 text-blue-800',
  'closed': 'bg-gray-100 text-gray-800',
  'rejected': 'bg-red-100 text-red-800',
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
          caseId,
          action
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update case');
      }

      // Update the local state to reflect the change
      const updatedCases = cases.map(c => 
        c._id === caseId 
          ? { ...c, status: action === 'accept' ? 'in progress' : 'rejected' } 
          : c
      );
      
      setCases(updatedCases);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error(err);
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
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error}</span>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Case Management</h1>
          <p className="text-gray-600 mt-1">Review and manage pending cases</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search cases..."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-black placeholder-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all" className="text-black">All Status</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-black"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all" className="text-black">All Types</option>
          <option value="civil">Civil</option>
          <option value="criminal">Criminal</option>
          <option value="family">Family</option>
          <option value="property">Property</option>
          <option value="consumer">Consumer</option>
          <option value="others">Others</option>
        </select>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filed Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No cases found
                </td>
              </tr>
            ) : (
              filteredCases.map((caseItem) => (
                <tr 
                  key={caseItem._id}
                  className={caseItem.status === 'pending' ? 'bg-yellow-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{caseItem._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{caseItem.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{caseItem.citizen?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{caseItem.caseType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[caseItem.status] || 'bg-gray-100 text-gray-800'}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(caseItem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link href={`/lawyer-dashboard/cases/${caseItem._id}`} className="text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                    
                    {caseItem.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleCaseAction(caseItem._id, 'accept')}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleCaseAction(caseItem._id, 'reject')}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
