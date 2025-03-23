'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

export default function CaseDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        description: 'Your case is being actively worked on'
      });
    }

    if (caseItem.status === 'resolved') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Resolved',
        description: 'Your case has been successfully resolved'
      });
    }

    if (caseItem.status === 'closed') {
      timeline.push({
        date: formatDate(caseItem.updatedAt),
        event: 'Case Closed',
        description: 'This case has been closed'
      });
    }

    return timeline;
  };

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

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'citizen') {
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
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [params.id, router]);

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
          href="/user-dashboard/cases"
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
        <Link href="/user-dashboard/cases" className="hover:text-green-600">
          My Cases
        </Link>
        <span>›</span>
        <span className="text-gray-700">Case Details</span>
      </div>

      {/* Case Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-black">{caseData.title}</h1>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(caseData.status)}`}>
              {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-gray-600">Case ID: <span className="text-gray-800">{caseData._id}</span></p>
            <p className="text-gray-600">Type: <span className="text-gray-800">{formatCaseType(caseData.caseType)}</span></p>
            <p className="text-gray-600">Filed on: <span className="text-gray-800">{formatDate(caseData.createdAt)}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Print Details
          </button>
          <Link
            href={`/user-dashboard/cases/${caseData._id}/update`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Update Case
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Timeline and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{caseData.description}</p>
          </div>

          {/* Case Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Case Timeline</h2>
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
        </div>

        {/* Right Column - Lawyer Info and Actions */}
        <div className="space-y-6">
          {/* Assigned Lawyer */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Lawyer</h2>
            {caseData.lawyer ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                    {caseData.lawyer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{caseData.lawyer.name}</p>
                    <p className="text-sm text-gray-500">Legal Counsel</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {caseData.lawyer.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {caseData.lawyer.phone}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">No lawyer has been assigned to this case yet.</p>
                <p className="text-sm text-gray-500">A lawyer will be assigned to your case soon.</p>
              </div>
            )}
          </div>

          {/* Case Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Status</h2>
            <div className={`p-4 rounded-lg ${getStatusColor(caseData.status)} bg-opacity-50`}>
              <h3 className="font-medium text-gray-900 mb-1">
                {caseData.status === 'pending' && 'Awaiting Review'}
                {caseData.status === 'in progress' && 'In Progress'}
                {caseData.status === 'resolved' && 'Case Resolved'}
                {caseData.status === 'closed' && 'Case Closed'}
                {caseData.status === 'rejected' && 'Case Rejected'}
              </h3>
              <p className="text-sm">
                {caseData.status === 'pending' && 'Your case is awaiting review by our legal team.'}
                {caseData.status === 'in progress' && 'Your case is being actively worked on by your assigned lawyer.'}
                {caseData.status === 'resolved' && 'Your case has been successfully resolved.'}
                {caseData.status === 'closed' && 'This case has been closed and is no longer active.'}
                {caseData.status === 'rejected' && 'Unfortunately, your case has been rejected.'}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(caseData.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
