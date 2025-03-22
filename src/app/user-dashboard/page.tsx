'use client';

import Link from 'next/link';

const OverviewCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-black text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-black mt-2">{value}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

const QuickAction = ({ href, label, icon }: { href: string; label: string; icon: string }) => (
  <Link
    href={href}
    className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
  >
    <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="ml-3 text-black font-medium group-hover:text-green-600 transition-colors">{label}</span>
  </Link>
);

const NotificationItem = ({ title, time, type }: { title: string; time: string; type: string }) => (
  <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
    <span className="text-2xl">{type === 'message' ? '💬' : '⏰'}</span>
    <div>
      <p className="font-medium text-black">{title}</p>
      <p className="text-sm text-black mt-1">{time}</p>
    </div>
  </div>
);

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Welcome back, John</h1>
        <p className="text-black mt-1">Here's what's happening with your cases today.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard title="Active Cases" value="3" icon="⚖️" />
        <OverviewCard title="Next Hearing" value="Tomorrow, 10 AM" icon="📅" />
        <OverviewCard title="Submitted Disputes" value="2" icon="📝" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickAction href="/user-dashboard/cases/new" label="Submit New Case" icon="📝" />
          <QuickAction href="/user-dashboard/assistant" label="Start AI Chat" icon="🤖" />
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-lg font-semibold text-black mb-4">Recent Notifications</h2>
        <div className="space-y-4">
          <NotificationItem
            title="New message from Adv. Sarah"
            time="10 minutes ago"
            type="message"
          />
          <NotificationItem
            title="Hearing tomorrow at 10 AM - Case #123"
            time="1 hour ago"
            type="reminder"
          />
        </div>
      </div>
    </div>
  );
}
