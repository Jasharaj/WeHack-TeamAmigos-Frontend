'use client';

import { useState } from 'react';
import Link from 'next/link';

const caseTypes = [
  'Property Dispute',
  'Family Law',
  'Criminal Defense',
  'Civil Litigation',
  'Consumer Protection',
  'Employment Law',
  'Contract Dispute',
  'Other'
];

export default function NewCase() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    documents: [] as File[],
    idProof: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'documents' | 'idProof') => {
    if (e.target.files) {
      if (field === 'documents') {
        setFormData(prev => ({
          ...prev,
          documents: [...Array.from(e.target.files as FileList)]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          idProof: (e.target.files as FileList)[0] || null
        }));
      }
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
        <h1 className="text-2xl font-bold text-black">Submit New Case</h1>
        <p className="text-black mt-1">Fill in the details below to submit your case</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 text-center relative ${
              s < step ? 'text-green-600' : s === step ? 'text-black' : 'text-black'
            }`}
          >
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                s <= step ? 'bg-green-100 text-green-600' : 'bg-gray-100'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            <div className="mt-2 text-sm">
              {s === 1 ? 'Basic Info' : s === 2 ? 'Case Details' : 'Documents'}
            </div>
            {s < 3 && (
              <div
                className={`absolute top-4 w-full h-0.5 ${
                  s < step ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Case Title
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Property Dispute - 123 Main St"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Case Type
              </label>
              <select
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="">Select case type...</option>
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Case Description
              </label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide a detailed description of your case..."
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                ID Proof
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'idProof')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-black mt-1">Upload a valid ID proof (Aadhaar, PAN, etc.)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Supporting Documents
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'documents')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-black mt-1">Upload any relevant documents (contracts, photos, etc.)</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Case
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
