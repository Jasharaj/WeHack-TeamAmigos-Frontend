'use client';

import { useState, useEffect } from 'react';
import { loadDocuments, saveDocuments, type Document } from '@/utils/dashboardStorage';

const categoryIcons = {
  contract: '📄',
  evidence: '🔍',
  court: '⚖️',
  identification: '🪪',
  other: '📎'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: '',
    description: '',
    category: 'other',
    fileName: '',
    fileType: '',
    fileSize: 0,
    status: 'pending'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load documents from localStorage on mount
  useEffect(() => {
    const savedDocuments = loadDocuments();
    setDocuments(savedDocuments);
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewDocument(prev => ({
        ...prev,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      }));
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const document: Document = {
      id: Date.now().toString(),
      title: newDocument.title || selectedFile.name,
      description: newDocument.description || '',
      category: newDocument.category as Document['category'],
      dateUploaded: new Date().toISOString(),
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      status: 'pending'
    };

    setDocuments(prev => [...prev, document]);
    setNewDocument({
      title: '',
      description: '',
      category: 'other',
      fileName: '',
      fileType: '',
      fileSize: 0,
      status: 'pending'
    });
    setSelectedFile(null);
    setShowUploadModal(false);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">My Documents</h1>
          <p className="text-black mt-1">Upload and manage your legal documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Upload Document
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl" role="img" aria-label={doc.category}>
                    {categoryIcons[doc.category]}
                  </span>
                  <h3 className="font-medium text-black truncate">{doc.title}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{doc.description}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    File: {doc.fileName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Size: {formatFileSize(doc.fileSize)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(doc.dateUploaded).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[doc.status]}`}>
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No documents uploaded yet.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold text-black mb-4">Upload Document</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Title</label>
                <input
                  type="text"
                  value={newDocument.title}
                  onChange={e => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  placeholder="Enter document title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Description</label>
                <textarea
                  value={newDocument.description}
                  onChange={e => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                  rows={3}
                  placeholder="Enter document description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Category</label>
                <select
                  value={newDocument.category}
                  onChange={e => setNewDocument(prev => ({ ...prev, category: e.target.value as Document['category'] }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                >
                  <option value="contract">Contract</option>
                  <option value="evidence">Evidence</option>
                  <option value="court">Court Document</option>
                  <option value="identification">Identification</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
