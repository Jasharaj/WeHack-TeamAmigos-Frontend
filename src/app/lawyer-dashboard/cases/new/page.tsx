'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCasePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement form submission
    setTimeout(() => {
      router.push('/dashboard/cases');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Add New Case</h1>
        <p className="text-gray-600 mt-1">Enter the details of the new case</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Case Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Case Type
              </label>
              <select
                id="type"
                name="type"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select type</option>
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
                <option value="Property">Property</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="hearingDate" className="block text-sm font-medium text-gray-700">
                First Hearing Date
              </label>
              <input
                type="date"
                id="hearingDate"
                name="hearingDate"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Case Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-semibold text-black">Client Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
                Client Email
              </label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">
                Client Phone
              </label>
              <input
                type="tel"
                id="clientPhone"
                name="clientPhone"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-semibold text-black">Documents</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Case Documents
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Case'}
          </button>
        </div>
      </form>
    </div>
  );
}
