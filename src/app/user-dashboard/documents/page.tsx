'use client';

import { useState } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedOn: string;
  caseId?: string;
  caseName?: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

const mockDocuments: Document[] = [
  {
    id: 'DOC1',
    name: 'Property Deed.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedOn: '2025-03-20',
    caseId: 'CASE123',
    caseName: 'Property Dispute - Smith vs. Johnson',
    status: 'Verified'
  },
  {
    id: 'DOC2',
    name: 'Evidence Photos.zip',
    type: 'ZIP',
    size: '5.1 MB',
    uploadedOn: '2025-03-20',
    caseId: 'CASE123',
    caseName: 'Property Dispute - Smith vs. Johnson',
    status: 'Verified'
  },
  {
    id: 'DOC3',
    name: 'Contract Agreement.pdf',
    type: 'PDF',
    size: '1.8 MB',
    uploadedOn: '2025-03-21',
    status: 'Pending'
  }
];

const statusColors = {
  Verified: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Rejected: 'bg-red-100 text-red-800'
};

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const filteredDocuments = mockDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.caseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle file upload
    console.log('Uploading files:', selectedFiles);
    setShowUploadModal(false);
    setSelectedFiles(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Documents</h1>
          <p className="text-black mt-1">Manage and organize your legal documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Upload Documents
        </button>
      </div>

      {/* Search */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Related Case</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Uploaded On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocuments.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {doc.type === 'PDF' ? '📄' : doc.type === 'ZIP' ? '📦' : '📎'}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-black">{doc.name}</div>
                      <div className="text-sm text-black">{doc.size}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {doc.caseName ? (
                    <div>
                      <div className="text-sm text-black">{doc.caseName}</div>
                      <div className="text-sm text-black">Case #{doc.caseId}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-black">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {doc.uploadedOn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[doc.status]}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  <button className="text-green-600 hover:text-green-700 mr-4">
                    Download
                  </button>
                  <button className="text-black hover:text-gray-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-black mb-4">Upload Documents</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Select Files
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Related Case (Optional)
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="">Select a case...</option>
                  <option value="CASE123">Property Dispute - Smith vs. Johnson</option>
                  <option value="CASE124">Consumer Complaint - Tech Solutions</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
