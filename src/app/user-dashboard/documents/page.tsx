'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Plus,
  File,
  FileImage,
  FileVideo,
  Archive,
  Paperclip,
  Calendar,
  Tag,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck,
  FolderOpen,
  BarChart3,
  Users,
  ToggleLeft,
  ToggleRight,
  Share2,
  Scale
} from 'lucide-react';
import config from '@/config';

interface Document {
  _id: string;
  title: string;
  description?: string;
  category: 'contract' | 'evidence' | 'court' | 'identification' | 'other';
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  status: 'pending' | 'approved' | 'rejected';
  tags: string[];
  caseId?: string;
  caseName?: string;
  shareSettings: {
    isPublic: boolean;
    sharedWith: string[];
    shareableLink?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Report {
  _id: string;
  title: string;
  content: string;
  status: 'draft' | 'final';
  caseId?: string;
  caseName?: string;
  reportType: 'case_summary' | 'legal_analysis' | 'client_report' | 'court_filing' | 'other';
  lawyerInfo: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const categoryIcons = {
  contract: FileText,
  evidence: FileCheck,
  court: FolderOpen,
  identification: File,
  other: Paperclip
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: AlertCircle
};

const reportTypeLabels = {
  case_summary: 'Case Summary',
  legal_analysis: 'Legal Analysis',
  client_report: 'Client Report',
  court_filing: 'Court Filing',
  other: 'Other'
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [sharedReports, setSharedReports] = useState<Report[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState<'documents' | 'reports'>('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: '',
    description: '',
    category: 'other',
    fileName: '',
    fileType: '',
    fileSize: 0,
    status: 'pending',
    tags: []
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    fetchDocuments();
    fetchSharedReports();
  }, []);

  // Fetch documents from backend
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch shared reports from backend
  const fetchSharedReports = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/reports/shared/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shared reports');
      }

      const data = await response.json();
      setSharedReports(data.data || []);
    } catch (err) {
      console.error('Error fetching shared reports:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewDocument(prev => ({
        ...prev,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        title: file.name.replace(/\.[^/.]+$/, '') // Remove extension from title
      }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !newDocument.title) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', newDocument.title);
      formData.append('description', newDocument.description || '');
      formData.append('category', newDocument.category || 'other');
      formData.append('tags', JSON.stringify(newDocument.tags || []));

      const response = await fetch(`${config.BASE_URL}/api/v1/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const data = await response.json();
      setDocuments(prev => [data.data, ...prev]);
      setShowUploadModal(false);
      resetForm();
    } catch (err) {
      console.error('Error uploading document:', err);
    }
  };

  const resetForm = () => {
    setNewDocument({
      title: '',
      description: '',
      category: 'other',
      fileName: '',
      fileType: '',
      fileSize: 0,
      status: 'pending',
      tags: []
    });
    setSelectedFile(null);
  };

  // Download document from Cloudinary
  const handleDownloadDocument = async (docId: string, fileName: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        alert('Please login to download documents');
        return;
      }

      console.log('Requesting download for document:', docId);
      const response = await fetch(`${config.BASE_URL}/api/v1/documents/${docId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Download response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download response error:', errorText);
        throw new Error(`Failed to get download link: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Download response data:', data);
      
      if (data.success && data.data.downloadUrl) {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = data.data.downloadUrl;
        link.download = fileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Invalid response format or missing download URL');
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`Failed to download document: ${errorMessage}`);
    }
  };

  // Preview document in new tab
  const handlePreviewDocument = async (docId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        alert('Please login to preview documents');
        return;
      }

      console.log('Requesting preview for document:', docId);
      const response = await fetch(`${config.BASE_URL}/api/v1/documents/${docId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Preview response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Preview response error:', errorText);
        throw new Error(`Failed to get preview link: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Preview response data:', data);
      
      if (data.success && data.data.downloadUrl) {
        // For PDFs and other documents, open in new tab
        const newWindow = window.open(data.data.downloadUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          // If popup was blocked, show alternative
          const confirmed = confirm('Popup was blocked. Would you like to open the document in the current tab?');
          if (confirmed) {
            window.location.href = data.data.downloadUrl;
          }
        }
      } else {
        throw new Error('Invalid response format or missing preview URL');
      }
    } catch (err) {
      console.error('Error previewing document:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`Failed to preview document: ${errorMessage}`);
    }
  };

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return FileImage;
    if (fileType.includes('video')) return FileVideo;
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('doc')) return FileText;
    if (fileType.includes('sheet') || fileType.includes('excel')) return FileText;
    if (fileType.includes('zip') || fileType.includes('rar')) return Archive;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(prev => prev.filter(doc => doc._id !== id));
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredReports = sharedReports.filter(report => {
    return report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           report.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[60vh]"
      >
        <div className="flex items-center gap-3 text-slate-600">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"
          />
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              {viewMode === 'documents' ? (
                <FileText className="w-6 h-6 text-white" />
              ) : (
                <BarChart3 className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {viewMode === 'documents' ? 'My Documents' : 'Shared Reports'}
              </h1>
              <p className="text-slate-600">
                {viewMode === 'documents' 
                  ? 'Manage and organize your legal documents' 
                  : 'View reports shared by your lawyers'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Toggle Button */}
            <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-sm p-1">
              <button
                onClick={() => setViewMode('documents')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'documents'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                My Documents ({documents.length})
              </button>
              <button
                onClick={() => setViewMode('reports')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'reports'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Shared Reports ({sharedReports.length})
              </button>
            </div>

            {/* Action Button */}
            {viewMode === 'documents' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
              >
                <Upload className="w-5 h-5" />
                Upload Document
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {viewMode === 'documents' ? 'Total Documents' : 'Shared Reports'}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {viewMode === 'documents' ? documents.length : sharedReports.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                {viewMode === 'documents' ? (
                  <FileText className="w-6 h-6 text-emerald-600" />
                ) : (
                  <Share2 className="w-6 h-6 text-emerald-600" />
                )}
              </div>
            </div>
          </motion.div>

          {viewMode === 'documents' ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Review</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                      {documents.filter(d => d.status === 'pending').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Approved</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                      {documents.filter(d => d.status === 'approved').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Size</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {formatFileSize(documents.reduce((total, doc) => total + doc.fileSize, 0))}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <Archive className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Case Reports</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {sharedReports.filter(r => r.reportType === 'case_summary').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Legal Analysis</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                      {sharedReports.filter(r => r.reportType === 'legal_analysis').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Client Reports</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {sharedReports.filter(r => r.reportType === 'client_report').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={viewMode === 'documents' ? "Search documents..." : "Search reports..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
              />
            </div>

            {viewMode === 'documents' && (
              <>
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  <option value="contract">Contract</option>
                  <option value="evidence">Evidence</option>
                  <option value="court">Court Document</option>
                  <option value="identification">Identification</option>
                  <option value="other">Other</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {viewMode === 'documents' ? (
          /* Documents View */
          <AnimatePresence>
            {filteredDocuments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
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
                  className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6"
                >
                  <FileText className="w-12 h-12 text-slate-400" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-4">No documents found</h3>
                <p className="text-slate-600 mb-8">
                  {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' 
                    ? 'No documents match your current filters.' 
                    : 'Upload your first document to get started.'}
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Upload className="w-5 h-5" />
                  Upload First Document
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document, index) => {
                  const CategoryIcon = categoryIcons[document.category];
                  const StatusIcon = statusIcons[document.status];
                  
                  return (
                    <motion.div
                      key={document._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                      className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 hover:border-emerald-200 transition-all duration-200"
                    >
                      {/* Document Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl flex items-center justify-center">
                            {(() => {
                              const FileIcon = getFileIcon(document.fileType);
                              return <FileIcon className="w-6 h-6 text-emerald-600" />;
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {document.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span className="capitalize">{document.category}</span>
                              <span>•</span>
                              <span>{formatFileSize(document.fileSize)}</span>
                              <span>•</span>
                              <span className="font-mono">{document.fileType.split('/')[1]?.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(document._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border ${statusColors[document.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                        </span>
                      </div>

                      {/* Description */}
                      {document.description && (
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                          {document.description}
                        </p>
                      )}

                      {/* File Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <File className="w-4 h-4" />
                          <span className="truncate">{document.fileName}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(document.createdAt)}
                          </div>
                          <span>{formatFileSize(document.fileSize)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-slate-100">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePreviewDocument(document._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDownloadDocument(document._id, document.fileName)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        ) : (
          /* Shared Reports View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-600" />
              Shared Reports from Lawyers ({sharedReports.length})
            </h2>
            
            {filteredReports.length === 0 ? (
              <div className="text-center py-16">
                <BarChart3 className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">
                  {searchQuery ? 'No reports match your search' : 'No shared reports found'}
                </p>
                <p className="text-slate-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'Reports shared by your lawyers will appear here'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-6 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-2xl border border-emerald-200/60 hover:border-emerald-300/80 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <h3 className="font-semibold text-slate-800 text-lg">{report.title}</h3>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            {reportTypeLabels[report.reportType]}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-3 line-clamp-2">{report.content.substring(0, 200)}...</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            By: {report.lawyerInfo?.name || 'Unknown Lawyer'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Shared: {formatDate(report.updatedAt)}
                          </span>
                          {report.caseName && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              Case: {report.caseName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Upload Document</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-6 space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Select File
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-300 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm font-medium text-slate-600">
                        {selectedFile ? selectedFile.name : 'Click to upload file'}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        PDF, DOC, DOCX, JPG, PNG up to 10MB
                      </span>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={newDocument.title}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter document title"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Category
                  </label>
                  <select
                    value={newDocument.category}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, category: e.target.value as Document['category'] }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900"
                  >
                    <option value="contract">Contract</option>
                    <option value="evidence">Evidence</option>
                    <option value="court">Court Document</option>
                    <option value="identification">Identification</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newDocument.description}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the document"
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile || !newDocument.title}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
