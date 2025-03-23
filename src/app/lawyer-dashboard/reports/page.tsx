'use client';

import { useState, useEffect } from 'react';
import { loadReports, saveReports, type Report } from '@/utils/dashboardStorage';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    title: '',
    content: '',
    status: 'draft'
  });

  // Load reports from localStorage on mount
  useEffect(() => {
    const savedReports = loadReports();
    setReports(savedReports);
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    const report: Report = {
      id: Date.now().toString(),
      title: newReport.title || '',
      content: newReport.content || '',
      date: new Date().toISOString(),
      status: newReport.status as 'draft' | 'final',
      lastModified: new Date().toISOString()
    };

    setReports(prev => [...prev, report]);
    setNewReport({
      title: '',
      content: '',
      status: 'draft'
    });
    setShowNewReportModal(false);
  };

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const handleFinalizeReport = (id: string) => {
    setReports(prev =>
      prev.map(report =>
        report.id === id
          ? { ...report, status: 'final', lastModified: new Date().toISOString() }
          : report
      )
    );
  };

  const draftReports = reports.filter(r => r.status === 'draft');
  const finalReports = reports.filter(r => r.status === 'final');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Legal Reports</h1>
          <p className="text-black mt-1">Manage your case reports and documentation</p>
        </div>
        <button
          onClick={() => setShowNewReportModal(true)}
          className="px-4 py-2 font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Create New Report
        </button>
      </div>

      {/* Draft Reports */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Draft Reports</h2>
        <div className="space-y-4">
          {draftReports.map(report => (
            <div
              key={report.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-black">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{report.content}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      Last modified: {new Date(report.lastModified).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Draft
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFinalizeReport(report.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Finalize
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {draftReports.length === 0 && (
            <p className="text-center text-gray-500 py-4">No draft reports</p>
          )}
        </div>
      </div>

      {/* Final Reports */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Final Reports</h2>
        <div className="space-y-4">
          {finalReports.map(report => (
            <div
              key={report.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-black">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{report.content}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      Finalized: {new Date(report.lastModified).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Final
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReport(report.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {finalReports.length === 0 && (
            <p className="text-center text-gray-500 py-4">No final reports</p>
          )}
        </div>
      </div>

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold text-black mb-4">Create New Report</h2>
            <form onSubmit={handleAddReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Title</label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={e => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Content</label>
                <textarea
                  value={newReport.content}
                  onChange={e => setNewReport(prev => ({ ...prev, content: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  rows={10}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="flex-1 bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
