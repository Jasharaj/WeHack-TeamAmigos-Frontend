'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Case {
  id: string;
  title: string;
  status: 'Active' | 'Pending' | 'Closed';
  hearingDate: string;
  lawyer: {
    name: string;
    email: string;
  };
}

const mockCases: Case[] = [
  {
    id: 'CASE123',
    title: 'Property Dispute - Smith vs. Johnson',
    status: 'Active',
    hearingDate: '2025-04-15',
    lawyer: {
      name: 'Adv. Sarah Wilson',
      email: 'sarah@casepilot.com'
    }
  },
  {
    id: 'CASE124',
    title: 'Consumer Complaint - Tech Solutions',
    status: 'Pending',
    hearingDate: '2025-04-20',
    lawyer: {
      name: 'Adv. Michael Brown',
      email: 'michael@casepilot.com'
    }
  }
];

export default function CasesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCases = mockCases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">My Cases</h1>
          <p className="text-black mt-1">Manage and track your legal cases</p>
        </div>
        <Link
          href="/user-dashboard/cases/new"
          className="btn-primary"
        >
          Submit New Case
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search cases..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Case ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Hearing Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Lawyer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCases.map((case_) => (
              <tr key={case_.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{case_.id}</td>
                <td className="px-6 py-4 text-sm text-black">{case_.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    case_.status === 'Active' ? 'bg-green-100 text-green-800' :
                    case_.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {case_.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{case_.hearingDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{case_.lawyer.name}</div>
                  <div className="text-sm text-black">{case_.lawyer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  <Link
                    href={`/user-dashboard/cases/${case_.id}`}
                    className="text-green-600 hover:text-green-900"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
