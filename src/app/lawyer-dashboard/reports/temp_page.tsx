'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  CheckCircle2, 
  Edit3, 
  Eye, 
  Download,
  Calendar,
  Clock,
  X,
  Trash2,
  BarChart3,
  Archive,
  FolderOpen,
  Users,
  ToggleLeft,
  ToggleRight,
  FileCheck,
  Upload
} from 'lucide-react';
import config from '@/config';

interface Report {
  _id: string;
  title: string;
  content: string;
  status: 'draft' | 'final';
  caseId?: string;
  caseName?: string;
  reportType: 'case_summary' | 'legal_analysis' | 'client_report' | 'court_filing' | 'other';
  createdAt: string;
  updatedAt: string;
}

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
  uploadedBy: {
    name: string;
    email: string;
  };
  caseId?: {
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [clientDocuments, setClientDocuments] = useState<Document[]>([]);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [viewMode, setViewMode] = useState<'reports' | 'documents'>('reports');
  const [loading, setLoading] = useState(true);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    title: '',
    content: '',
    status: 'draft',
    reportType: 'other'
  });

  // Load data on mount
  useEffect(() => {
    fetchReports();
    fetchClientDocuments();
  }, []);

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data.data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch client documents from backend
  const fetchClientDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/documents/clients/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client documents');
      }

      const data = await response.json();
      setClientDocuments(data.data || []);
    } catch (err) {
      console.error('Error fetching client documents:', err);
    }
  };

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReport)
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      const data = await response.json();
      setReports(prev => [data.data, ...prev]);
      setShowNewReportModal(false);
      resetForm();
    } catch (err) {
      console.error('Error creating report:', err);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }

      setReports(prev => prev.filter(report => report._id !== reportId));
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  const handleFinalizeReport = async (reportId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/reports/${reportId}/finalize`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to finalize report');
      }

      const data = await response.json();
      setReports(prev => prev.map(report => 
        report._id === reportId ? data.data : report
      ));
    } catch (err) {
      console.error('Error finalizing report:', err);
    }
  };

  const resetForm = () => {
    setNewReport({
      title: '',
      content: '',
      status: 'draft',
      reportType: 'other'
    });
  };

  const draftReports = reports.filter(r => r.status === 'draft');
  const finalReports = reports.filter(r => r.status === 'final');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              {viewMode === 'reports' ? (
                <BarChart3 className="w-6 h-6 text-white" />
              ) : (
                <FolderOpen className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {viewMode === 'reports' ? 'Legal Reports' : 'Client Documents'}
              </h1>
              <p className="text-slate-600">
                {viewMode === 'reports' 
                  ? 'Create and manage your legal reports' 
                  : 'View documents uploaded by your clients'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Toggle Button */}
            <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-sm p-1">
              <button
                onClick={() => setViewMode('reports')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'reports'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                My Reports
              </button>
              <button
                onClick={() => setViewMode('documents')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'documents'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                Client Docs ({clientDocuments.length})
              </button>
            </div>

            {/* Action Button */}
            {viewMode === 'reports' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewReportModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg font-medium transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                New Report
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
                  {viewMode === 'reports' ? 'Total Reports' : 'Client Documents'}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {viewMode === 'reports' ? reports.length : clientDocuments.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                {viewMode === 'reports' ? (
                  <FileText className="w-6 h-6 text-emerald-600" />
                ) : (
                  <Upload className="w-6 h-6 text-emerald-600" />
                )}
              </div>
            </div>
          </motion.div>

          {viewMode === 'reports' ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Draft Reports</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{draftReports.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <Edit3 className="w-6 h-6 text-amber-600" />
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
                    <p className="text-sm font-medium text-slate-600">Final Reports</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{finalReports.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
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
                    <p className="text-sm font-medium text-slate-600">Pending Review</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                      {clientDocuments.filter(d => d.status === 'pending').length}
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
                      {clientDocuments.filter(d => d.status === 'approved').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Content */}
        {viewMode === 'reports' ? (
          /* Reports View */
          <div className="space-y-8">
            {/* Draft Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                Draft Reports ({draftReports.length})
              </h2>
              
              {draftReports.length === 0 ? (
                <div className="text-center py-12">
                  <Archive className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No draft reports yet</p>
                  <p className="text-sm text-slate-500 mt-2">Create your first report to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {draftReports.map((report, index) => (
                    <motion.div
                      key={report._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-6 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-2xl border border-amber-200/60"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 text-lg">{report.title}</h3>
                          <p className="text-slate-600 mt-2 line-clamp-2">{report.content.substring(0, 200)}...</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Created: {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Modified: {new Date(report.updatedAt).toLocaleDateString()}
                            </span>
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
                            onClick={() => handleFinalizeReport(report._id)}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteReport(report._id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Final Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Final Reports ({finalReports.length})
              </h2>
              
              {finalReports.length === 0 ? (
                <div className="text-center py-12">
                  <Archive className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No final reports yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {finalReports.map((report, index) => (
                    <motion.div
                      key={report._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-6 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-2xl border border-emerald-200/60"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 text-lg">{report.title}</h3>
                          <p className="text-slate-600 mt-2 line-clamp-2">{report.content.substring(0, 200)}...</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Finalized: {new Date(report.updatedAt).toLocaleDateString()}
                            </span>
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
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteReport(report._id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          /* Client Documents View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Client Documents ({clientDocuments.length})
            </h2>
            
            {clientDocuments.length === 0 ? (
              <div className="text-center py-16">
                <FolderOpen className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No client documents found</p>
                <p className="text-slate-500">Documents uploaded by your clients will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientDocuments.map((doc, index) => (
                  <motion.div
                    key={doc._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">{doc.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{doc.fileName}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          doc.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status === 'pending' ? <Clock className="w-3 h-3" /> : 
                           doc.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> :
                           <X className="w-3 h-3" />}
                          {doc.status}
                        </div>
                      </div>
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>By: {doc.uploadedBy?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4" />
                        <span>{formatFileSize(doc.fileSize)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                      {doc.caseId && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>Case: {doc.caseId.title}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* New Report Modal */}
      <AnimatePresence>
        {showNewReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Create New Report</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNewReportModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <form onSubmit={handleAddReport} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Report Title</label>
                  <input
                    type="text"
                    value={newReport.title}
                    onChange={e => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 transition-all"
                    placeholder="Enter report title..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
                  <select
                    value={newReport.reportType}
                    onChange={e => setNewReport(prev => ({ ...prev, reportType: e.target.value as Report['reportType'] }))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 transition-all"
                  >
                    <option value="other">Other</option>
                    <option value="case_summary">Case Summary</option>
                    <option value="legal_analysis">Legal Analysis</option>
                    <option value="client_report">Client Report</option>
                    <option value="court_filing">Court Filing</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                  <textarea
                    value={newReport.content}
                    onChange={e => setNewReport(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 transition-all resize-none"
                    placeholder="Write your report content..."
                    rows={8}
                    required
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 font-medium transition-all duration-200"
                  >
                    Create Report
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNewReportModal(false)}
                    className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 font-medium transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
