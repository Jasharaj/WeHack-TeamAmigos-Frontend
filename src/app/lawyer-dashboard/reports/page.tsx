'use client';

import { useState } from 'react';

interface CaseStats {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  upcomingHearings: number;
  averageResolutionTime: string;
  successRate: number;
}

interface MonthlyData {
  month: string;
  newCases: number;
  resolvedCases: number;
  hearings: number;
}

const mockStats: CaseStats = {
  totalCases: 156,
  activeCases: 42,
  resolvedCases: 114,
  upcomingHearings: 8,
  averageResolutionTime: '4.5 months',
  successRate: 87
};

const mockMonthlyData: MonthlyData[] = [
  { month: 'Jan', newCases: 12, resolvedCases: 8, hearings: 15 },
  { month: 'Feb', newCases: 15, resolvedCases: 10, hearings: 18 },
  { month: 'Mar', newCases: 10, resolvedCases: 12, hearings: 14 }
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Reports & Analytics</h1>
          <p className="text-black mt-1">Track your performance and insights</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-input px-4 py-2 rounded-lg"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Case Overview</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-black">Total Cases</p>
              <p className="text-2xl font-bold text-black">{mockStats.totalCases}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-black">Active</p>
                <p className="text-xl font-semibold text-blue-600">{mockStats.activeCases}</p>
              </div>
              <div>
                <p className="text-sm text-black">Resolved</p>
                <p className="text-xl font-semibold text-green-600">{mockStats.resolvedCases}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-black">Success Rate</p>
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-bold text-black">{mockStats.successRate}%</p>
                <p className="text-sm text-green-600">↑ 2.4%</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-black">Avg. Resolution Time</p>
              <p className="text-xl font-semibold text-black">{mockStats.averageResolutionTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Upcoming Activity</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-black">Upcoming Hearings</p>
              <p className="text-2xl font-bold text-black">{mockStats.upcomingHearings}</p>
            </div>
            <div>
              <p className="text-sm text-black">Next 7 Days</p>
              <div className="mt-2 space-y-2">
                <div className="text-sm">
                  <p className="font-medium text-black">Smith vs Corp</p>
                  <p className="text-black">Mar 25, 10:30 AM</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-black">Property Dispute</p>
                  <p className="text-black">Mar 27, 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'cases', label: 'Cases' },
              { id: 'hearings', label: 'Hearings' },
              { id: 'disputes', label: 'Disputes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`pb-4 px-1 ${
                  selectedReport === tab.id
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-black hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {/* Monthly Trends */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Monthly Trends</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">New Cases</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Resolved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Hearings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Resolution Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockMonthlyData.map((data) => (
                    <tr key={data.month}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {data.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {data.newCases}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {data.resolvedCases}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {data.hearings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {Math.round((data.resolvedCases / data.newCases) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-black mb-4">Export Options</h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <p className="font-medium text-black">Monthly Report</p>
                <p className="text-sm text-black mt-1">Detailed analysis of monthly performance</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <p className="font-medium text-black">Case Summary</p>
                <p className="text-sm text-black mt-1">Overview of all case statuses and outcomes</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <p className="font-medium text-black">Custom Report</p>
                <p className="text-sm text-black mt-1">Generate report with specific parameters</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
