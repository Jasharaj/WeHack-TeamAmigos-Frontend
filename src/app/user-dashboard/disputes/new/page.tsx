'use client';

import { useState } from 'react';
import Link from 'next/link';

const disputeTypes = [
  'Property',
  'Consumer',
  'Tenancy',
  'Employment',
  'Contract',
  'Family',
  'Other'
];

interface FormData {
  title: string;
  type: string;
  description: string;
  respondentName: string;
  respondentContact: string;
  documents: File[];
  preferredResolution: string;
  mediationPreference: boolean;
}

export default function NewDisputePage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: '',
    description: '',
    respondentName: '',
    respondentContact: '',
    documents: [],
    preferredResolution: '',
    mediationPreference: false
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: [...Array.from(e.target.files as FileList)]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Submit New Dispute</h1>
        <p className="text-black mt-1">
          Provide details about your dispute for resolution
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-black">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Dispute Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Property Boundary Dispute with Neighbor"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Dispute Type
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select dispute type...</option>
              {disputeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Dispute Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Provide a detailed description of your dispute..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Respondent Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-black">Respondent Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Respondent Name
            </label>
            <input
              type="text"
              required
              value={formData.respondentName}
              onChange={(e) => setFormData(prev => ({ ...prev, respondentName: e.target.value }))}
              placeholder="Name of the person or organization"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Respondent Contact Information
            </label>
            <input
              type="text"
              required
              value={formData.respondentContact}
              onChange={(e) => setFormData(prev => ({ ...prev, respondentContact: e.target.value }))}
              placeholder="Email or phone number"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-black">Supporting Documents</h2>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Upload Documents
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full"
            />
            <p className="text-sm text-black mt-1">
              Upload any relevant documents that support your case (contracts, photos, correspondence, etc.)
            </p>
          </div>
        </div>

        {/* Resolution Preferences */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-black">Resolution Preferences</h2>
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Preferred Resolution
            </label>
            <textarea
              value={formData.preferredResolution}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredResolution: e.target.value }))}
              rows={3}
              placeholder="Describe your preferred outcome or resolution..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.mediationPreference}
                onChange={(e) => setFormData(prev => ({ ...prev, mediationPreference: e.target.checked }))}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-black">
                I am willing to participate in mediation to resolve this dispute
              </span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/user-dashboard/disputes"
            className="px-6 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Dispute
          </button>
        </div>
      </form>
    </div>
  );
}
