'use client';

import Link from 'next/link';

const OverviewCard = ({ title, value, icon, trend }: { title: string; value: string; icon: string; trend?: { value: string; positive: boolean } }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
    <div className="flex items-center justify-between">
      <span className="text-2xl">{icon}</span>
      {trend && (
        <span className={`text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </span>
      )}
    </div>
    <h3 className="text-black text-sm font-medium mt-4">{title}</h3>
    <p className="text-black text-2xl font-bold mt-2">{value}</p>
  </div>
);

const QuickActionCard = ({ title, description, icon, href }: { title: string; description: string; icon: string; href: string }) => (
  <Link 
    href={href}
    className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:border-green-300 transition-all duration-200 group"
  >
    <span className="text-3xl">{icon}</span>
    <h3 className="text-black font-semibold mt-4 group-hover:text-green-600 transition-colors">{title}</h3>
    <p className="text-black text-sm mt-2">{description}</p>
  </Link>
);

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Welcome back, Advocate</h1>
        <p className="text-black mt-1">Here's what's happening with your cases today.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OverviewCard
          title="Active Cases"
          value="24"
          icon="⚖️"
          trend={{ value: '12%', positive: true }}
        />
        <OverviewCard
          title="Pending Disputes"
          value="8"
          icon="🤝"
          trend={{ value: '5%', positive: false }}
        />
        <OverviewCard
          title="Next Hearing"
          value="Tomorrow, 10:00 AM"
          icon="📅"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Add New Case"
            description="Create a new case record with client details"
            icon="📝"
            href="/dashboard/cases/new"
          />
          <QuickActionCard
            title="Start Legal Research"
            description="Use AI to research case laws and precedents"
            icon="🔍"
            href="/dashboard/assistant"
          />
          <QuickActionCard
            title="View Reminders"
            description="Check upcoming hearings and deadlines"
            icon="🔔"
            href="/dashboard/reminders"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-green-100 divide-y divide-green-100">
          {[
            { icon: '📄', title: 'New case file added', time: '2 hours ago', description: 'Civil Dispute - John vs Smith Corp' },
            { icon: '📅', title: 'Hearing scheduled', time: '5 hours ago', description: 'Criminal Case #123 - Next Monday, 11 AM' },
            { icon: '💬', title: 'Client message received', time: 'Yesterday', description: 'Re: Document submission for case #456' },
          ].map((item, i) => (
            <div key={i} className="p-4 flex items-start space-x-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="text-black font-medium">{item.title}</h3>
                <p className="text-black text-sm mt-1">{item.description}</p>
                <span className="text-black text-xs mt-2 block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
