import { useQuery } from '@tanstack/react-query';
import { FileText, MessageSquare, Package, Newspaper } from 'lucide-react';
import { getMetrics, getTrend, getRecentRFQ } from '@/services/dashboardService';
import MetricCard  from '@/components/dashboard/MetricCard';
import TrendChart  from '@/components/dashboard/TrendChart';
import RecentRFQ   from '@/components/dashboard/RecentRFQ';
import { SectionHeader } from '@/components/ui/index';

export default function DashboardPage() {
  const { data: metricsData, isLoading: mLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => getMetrics().then((r) => r.data.data),
    refetchInterval: 60_000,
  });

  const { data: trendData, isLoading: tLoading } = useQuery({
    queryKey: ['dashboard-trend'],
    queryFn: () => getTrend().then((r) => r.data.data),
    staleTime: 5 * 60_000,
  });

  const { data: rfqData, isLoading: rLoading } = useQuery({
    queryKey: ['dashboard-recent-rfq'],
    queryFn: () => getRecentRFQ().then((r) => r.data.data),
    refetchInterval: 30_000,
  });

  const m = metricsData ?? {};

  const METRICS = [
    {
      title: 'RFQ Belum Dibaca',
      value: m.rfq_unread,
      icon:  FileText,
      color: 'amber',
      sub:   'Permintaan penawaran baru',
    },
    {
      title: 'Pesan Masuk Baru',
      value: m.contact_unread,
      icon:  MessageSquare,
      color: 'crimson',
      sub:   'Dari form kontak website',
    },
    {
      title: 'Total Produk Aktif',
      value: m.products_active,
      icon:  Package,
      color: 'navy',
      sub:   'Ditampilkan di website',
    },
    {
      title: 'Artikel Tayang',
      value: m.news_published,
      icon:  Newspaper,
      color: 'green',
      sub:   'Berita & aktivitas',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Dashboard"
        subtitle={`Selamat datang, pantau aktivitas MNI hari ini.`}
      />

      {/* ── Metric Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <MetricCard key={m.title} {...m} loading={mLoading} />
        ))}
      </div>

      {/* ── Chart + Quick Actions row ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-obsidian-800 text-base">
                Tren RFQ & Pesan
              </h2>
              <p className="text-xs text-obsidian-400 mt-0.5">30 hari terakhir</p>
            </div>
          </div>
          <TrendChart data={trendData} loading={tLoading} />
        </div>

        {/* Summary Stats */}
        <div className="card p-5 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-obsidian-800 text-base">Ringkasan</h2>
          <div className="space-y-3">
            {[
              { label: 'Total Produk',    val: m.products_total    ?? '-', accent: 'bg-navy-500' },
              { label: 'Total Layanan',   val: m.services_total    ?? '-', accent: 'bg-amber-500' },
              { label: 'Total Portfolio', val: m.portfolio_total   ?? '-', accent: 'bg-emerald-500' },
              { label: 'Total Berita',    val: m.news_total        ?? '-', accent: 'bg-obsidian-400' },
              { label: 'Total Testimoni', val: m.testimonials_total ?? '-', accent: 'bg-crimson-400' },
              { label: 'Total RFQ',       val: m.rfq_total         ?? '-', accent: 'bg-amber-600' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${s.accent}`} />
                  <span className="text-sm text-obsidian-600">{s.label}</span>
                </div>
                {mLoading
                  ? <div className="skeleton h-4 w-8 rounded" />
                  : <span className="font-display font-semibold text-obsidian-800">{s.val}</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent RFQ table ─────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-obsidian-800 text-base">
              5 RFQ Terbaru
            </h2>
            <p className="text-xs text-obsidian-400 mt-0.5">Permintaan penawaran yang perlu ditindaklanjuti</p>
          </div>
          {m.rfq_unread > 0 && (
            <span className="badge badge-amber">{m.rfq_unread} belum dibaca</span>
          )}
        </div>
        <RecentRFQ data={rfqData ?? []} loading={rLoading} />
      </div>
    </div>
  );
}
