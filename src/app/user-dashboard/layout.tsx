import UserDashboardLayout from '@/components/user-dashboard/UserDashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>;
}
