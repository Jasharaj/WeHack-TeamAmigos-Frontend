'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileEdit, 
  ArrowLeft, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Scale,
  Building,
  FileText
} from 'lucide-react';
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[70vh]"
      >
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-lg">Loading...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white"
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Link 
            href="/user-dashboard/cases"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Cases
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileEdit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">File New Case</h1>
              <p className="text-slate-600 mt-1">Provide details about your legal case to get started</p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-emerald-800 font-semibold">Case submitted successfully!</p>
                  <p className="text-emerald-700 text-sm mt-1">Redirecting you to your cases...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 space-y-8"
        >
          {/* Case Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                Case Title 
                <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title for your case"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 bg-white transition-all duration-200 hover:border-slate-300"
              required
            />
          </motion.div>

          {/* Case Type */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="caseType" className="block text-sm font-semibold text-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                Case Type 
                <span className="text-red-500">*</span>
              </div>
            </label>
            <select
              id="caseType"
              name="caseType"
              value={formData.caseType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 bg-white transition-all duration-200 hover:border-slate-300"
              required
            >
              <option value="">Select case type</option>
              {caseTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Case Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Case Description 
                <span className="text-red-500">*</span>
              </div>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Provide a detailed description of your case including relevant facts, dates, and your concerns"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 bg-white transition-all duration-200 hover:border-slate-300 resize-none"
              required
            />
          </motion.div>

          {/* Lawyer Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="lawyerId" className="block text-sm font-semibold text-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                Select Lawyer (Optional)
              </div>
            </label>
            {loadingLawyers ? (
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                <span className="text-sm text-slate-600">Loading available lawyers...</span>
              </div>
            ) : (
              <select
                id="lawyerId"
                name="lawyerId"
                value={formData.lawyerId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 bg-white transition-all duration-200 hover:border-slate-300"
              >
                <option value="">No preference (system will assign)</option>
                {lawyers.map(lawyer => (
                  <option key={lawyer._id} value={lawyer._id}>
                    {lawyer.name} {lawyer.specialization ? `- ${lawyer.specialization}` : ''}
                  </option>
                ))}
              </select>
            )}
            <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              You can select a specific lawyer or leave it blank to have one assigned based on expertise
            </p>
          </motion.div>

          {/* Form Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200"
          >
            <Link
              href="/user-dashboard/cases"
              className="w-full sm:w-auto px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-medium text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold transition-all duration-200 ${
                submitting 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FileEdit className="w-5 h-5" />
                  Submit Case
                </span>
              )}
            </button>
          </motion.div>
        </motion.form>

        {/* Help Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-blue-900">What happens next?</h3>
          </div>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Your case will be reviewed by our legal team</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>If you selected a lawyer, they will be notified immediately</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>If no lawyer was selected, we'll assign one based on expertise and availability</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>You'll receive real-time updates on your case status through the dashboard</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}
