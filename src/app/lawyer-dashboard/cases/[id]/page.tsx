'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config from '@/config';

interface Case {
  _id: string;
  title: string;
  description: string;
  caseType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  citizen: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  lawyer?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialization?: string;
  };
}

// Timeline event component
const TimelineItem = ({ date, event, description }: { date: string; event: string; description: string }) => (
  <div className="relative pb-8 last:pb-0">
    <div className="absolute left-4 -ml-0.5 mt-1.5 h-full w-0.5 bg-gray-200 last:hidden"></div>
    <div className="relative flex items-start space-x-3">
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
          <span className="text-green-600 text-sm">📅</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div>
          <div className="text-sm text-gray-500">{date}</div>
          <p className="mt-0.5 text-sm font-medium text-gray-900">{event}</p>
        </div>
        <div className="mt-2 text-sm text-gray-700">
          <p>{description}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function CaseDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [status, setStatus] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get appropriate status color
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

  // Format case type for display
  const formatCaseType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format status for display
  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Generate timeline events based on case data
  const generateTimeline = (caseItem: Case) => {
    const timeline = [
      {
        date: formatDate(caseItem.createdAt),
        event: 'Case Created',
        description: `Case "${caseItem.title}" was submitted for review`
      }
    ];

    if (caseItem.lawyer) {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Lawyer Assigned',
        description: `${caseItem.lawyer.name} was assigned to the case`
      });
    }

    if (caseItem.status === 'in progress') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case In Progress',
        description: 'The case is being actively worked on'
      });
    }

    if (caseItem.status === 'resolved') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Resolved',
        description: 'The case has been successfully resolved'
      });
    }

    if (caseItem.status === 'closed') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Closed',
        description: 'This case has been closed'
      });
    }

    if (caseItem.status === 'rejected') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Rejected',
        description: 'This case has been rejected'
      });
    }

    return timeline;
  };

  // Handle case update
  const handleUpdateCase = async () => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/cases/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: status || caseData?.status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update case');
      }

      const data = await response.json();
      setCaseData(data.data);
      setIsEditing(false);
      setUpdateSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      setUpdateError(err.message || 'Something went wrong');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle case acceptance or rejection
  const handleCaseAction = async (action: 'accept' | 'reject') => {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/cases/${params.id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          caseId: params.id,
          action
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} case`);
      }

      const data = await response.json();
      setCaseData(data.data);
      setUpdateSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      setUpdateError(err.message || 'Something went wrong');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'lawyer') {
      router.push('/login');
      return;
    }

    // Fetch case data
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`${config.BASE_URL}/api/v1/cases/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch case details');
        }

        const data = await response.json();
        setCaseData(data.data);
        setStatus(data.data.status);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [params.id, router]);

  const TabButton = ({ tab, label }: { tab: typeof activeTab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-green-50 text-green-600'
          : 'text-black hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 max-w-4xl mx-auto my-8">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg text-yellow-600 max-w-4xl mx-auto my-8">
        <h3 className="text-lg font-semibold mb-2">Case Not Found</h3>
        <p>The case you're looking for could not be found.</p>
        <Link
          href="/lawyer-dashboard/cases"
          className="mt-4 px-4 py-2 inline-block bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Back to Cases
        </Link>
      </div>
    );
  }

  const timeline = generateTimeline(caseData);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Header with navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link href="/lawyer-dashboard/cases" className="hover:text-green-600">
          My Cases
        </Link>
        <span>›</span>
        <span className="text-gray-700">Case Details</span>
      </div>

      {/* Success/Error Messages */}
      {updateSuccess && (
        <div className="bg-green-50 p-4 rounded-lg text-green-600">
          <p>Case updated successfully!</p>
        </div>
      )}
      
      {updateError && (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          <p>{updateError}</p>
        </div>
      )}

      {/* Case Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-black">{caseData.title}</h1>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(caseData.status)}`}>
              {formatStatus(caseData.status)}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-gray-600">Case ID: <span className="text-gray-800">{caseData._id}</span></p>
            <p className="text-gray-600">Type: <span className="text-gray-800">{formatCaseType(caseData.caseType)}</span></p>
            <p className="text-gray-600">Filed on: <span className="text-gray-800">{formatDate(caseData.createdAt)}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          {caseData.status === 'pending' && (
            <>
              <button 
                onClick={() => handleCaseAction('accept')} 
                disabled={updateLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {updateLoading ? 'Processing...' : 'Accept Case'}
              </button>
              <button 
                onClick={() => handleCaseAction('reject')} 
                disabled={updateLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {updateLoading ? 'Processing...' : 'Reject Case'}
              </button>
            </>
          )}
          {caseData.status !== 'pending' && (
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Update Status'}
            </button>
          )}
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Print Details
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <TabButton tab="details" label="Case Details" />
        <TabButton tab="history" label="Case Timeline" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Case Type</label>
                  <p className="mt-1 text-black">{formatCaseType(caseData.caseType)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Status</label>
                  {isEditing ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-black">{formatStatus(caseData.status)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Last Updated</label>
                  <p className="mt-1 text-black">{formatDate(caseData.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-4">Client Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black">Name</label>
                  <p className="mt-1 text-black">{caseData.citizen.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Email</label>
                  <p className="mt-1 text-black">{caseData.citizen.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Phone</label>
                  <p className="mt-1 text-black">{caseData.citizen.phone}</p>
                </div>
              </div>
            </div>

            {/* Case Description */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-4">Case Description</h2>
              <p className="mt-1 text-black whitespace-pre-wrap">{caseData.description}</p>
            </div>

            {/* Update Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleUpdateCase}
                  disabled={updateLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-lg font-semibold text-black mb-6">Case Timeline</h2>
            {timeline.length > 0 ? (
              <div className="pl-4">
                {timeline.map((item, index) => (
                  <TimelineItem key={index} {...item} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No timeline events available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
