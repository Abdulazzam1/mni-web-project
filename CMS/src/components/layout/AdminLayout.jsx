import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmProvider } from '@/components/ui/Confirm';
import { getMetrics } from '@/services/dashboardService';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  // Ambil unread count untuk badge sidebar & notif topbar
  const { data } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => getMetrics().then((r) => r.data.data),
    refetchInterval: 60 * 1000, // refresh tiap 1 menit
    staleTime: 30 * 1000,
  });

  const unread = {
    rfq:     data?.rfq_unread    ?? 0,
    contact: data?.contact_unread ?? 0,
  };

  const sidebarW = collapsed ? '64px' : '260px';

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="h-full flex">
          {/* ── Sidebar ─────────────────────── */}
          <Sidebar
            unread={unread}
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />

          {/* ── Main area ───────────────────── */}
          <div
            className="flex-1 flex flex-col min-h-screen transition-all duration-300"
            style={{ marginLeft: sidebarW }}
          >
            <Topbar sidebarCollapsed={collapsed} unread={unread} />

            {/* Page content */}
            <main className="flex-1 mt-16 p-6 bg-surface overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}
