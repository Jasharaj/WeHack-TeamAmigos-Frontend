'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import config from '@/config';

interface Lawyer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
}

const caseTypes = [
  { value: 'civil', label: 'Civil' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'family', label: 'Family' },
  { value: 'property', label: 'Property' },
  { value: 'consumer', label: 'Consumer' },
  { value: 'others', label: 'Others' }
];

export default function NewCase() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loadingLawyers, setLoadingLawyers] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    caseType: '',
    description: '',
    lawyerId: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'citizen') {
      router.push('/login');
      return;
    }

    // Fetch lawyers for dropdown
    const fetchLawyers = async () => {
      try {
        setLoadingLawyers(true);
        const response = await fetch(`${config.BASE_URL}/api/v1/lawyer/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch lawyers');
        }

        const data = await response.json();
        setLawyers(data.data);
      } catch (err: any) {
        console.error('Error fetching lawyers:', err);
        setError('Failed to load lawyers. Please try again later.');
      } finally {
        setLoadingLawyers(false);
      }
    };

    fetchLawyers();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Please enter a case title');
      return;
    }
    
    if (!formData.caseType) {
      setError('Please select a case type');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Please provide a case description');
      return;
    }
    
    try {
      setError('');
      setSubmitting(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BASE_URL}/api/v1/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          caseType: formData.caseType,
          ...(formData.lawyerId && { lawyerId: formData.lawyerId })
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create case');
      }
      
      setSuccess(true);
      
      // Redirect to cases list after successful submission
      setTimeout(() => {
        router.push('/user-dashboard/cases');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error submitting case:', err);
      setError(err.message || 'Failed to submit case. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">File New Case</h1>
        <p className="text-gray-600 mt-1">Provide details about your legal case</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">Your case has been successfully submitted!</p>
          <p className="text-green-600 text-sm mt-1">Redirecting to your cases...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Case Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Case Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a descriptive title for your case"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            required
          />
        </div>

        {/* Case Type */}
        <div>
          <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-1">
            Case Type <span className="text-red-500">*</span>
          </label>
          <select
            id="caseType"
            name="caseType"
            value={formData.caseType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            required
          >
            <option value="">Select case type</option>
            {caseTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Case Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Case Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Provide a detailed description of your case including relevant facts, dates, and your concerns"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            required
          />
        </div>

        {/* Lawyer Selection */}
        <div>
          <label htmlFor="lawyerId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Lawyer (Optional)
          </label>
          {loadingLawyers ? (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-green-500 rounded-full"></div>
              <span>Loading lawyers...</span>
            </div>
          ) : (
            <select
              id="lawyerId"
              name="lawyerId"
              value={formData.lawyerId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            >
              <option value="">No preference (system will assign)</option>
              {lawyers.map(lawyer => (
                <option key={lawyer._id} value={lawyer._id}>
                  {lawyer.name} {lawyer.specialization ? `- ${lawyer.specialization}` : ''}
                </option>
              ))}
            </select>
          )}
          <p className="text-sm text-gray-500 mt-1">
            You can select a specific lawyer or leave it blank to have one assigned to you
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between pt-4">
          <Link
            href="/user-dashboard/cases"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 bg-green-600 text-white rounded-lg transition-colors ${
              submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
          >
            {submitting ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Submitting...
              </span>
            ) : (
              'Submit Case'
            )}
          </button>
        </div>
      </form>

      {/* Help Information */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Your case will be reviewed by our team</li>
          <li>If you selected a lawyer, they will be notified of your case</li>
          <li>If you didn't select a lawyer, our system will assign one based on expertise and availability</li>
          <li>You'll receive updates on your case status via the dashboard</li>
        </ul>
      </div>
    </div>
  );
}
