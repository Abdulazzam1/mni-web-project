import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, CheckCircle, FileText, Eye } from 'lucide-react';
import * as svc from '@/services/rfqService';
import { SectionHeader, Badge, EmptyState, PageSpinner } from '@/components/ui/index';
import { SearchInput } from '@/components/ui/index';
import DataTable from '@/components/ui/DataTable';
import { useToastCtx } from '@/components/ui/Toast';
import { useTable } from '@/hooks/useTable';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateTime } from '@/utils/formatters';
import { replyRFQ } from '@/utils/whatsapp';

// Modal detail RFQ
function RFQDetailModal({ rfq, onClose }) {
  if (!rfq) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-obsidian-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg animate-fade-in">
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="font-display font-semibold text-obsidian-800">Detail RFQ #{rfq.id}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {[
            { l: 'Perusahaan',   v: rfq.company_name },
            { l: 'Nama Kontak',  v: rfq.contact_name },
            { l: 'Email',        v: rfq.email },
            { l: 'Telepon',      v: rfq.phone || '-' },
            { l: 'Produk Minat', v: rfq.product_interest },
            { l: 'Tanggal',      v: formatDateTime(rfq.created_at) },
          ].map(({ l, v }) => (
            <div key={l} className="grid grid-cols-[120px_1fr] gap-2 text-sm">
              <span className="text-obsidian-400 font-medium">{l}</span>
              <span className="text-obsidian-800">{v}</span>
            </div>
          ))}
          {rfq.message && (
            <div className="mt-2 pt-3 border-t border-surface-border">
              <p className="text-xs text-obsidian-400 mb-1.5 font-medium uppercase tracking-wider">Pesan</p>
              <p className="text-sm text-obsidian-700 leading-relaxed whitespace-pre-line">{rfq.message}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-surface-border flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-outline btn-sm">Tutup</button>
          <button onClick={() => replyRFQ(rfq)} className="btn btn-primary btn-sm">
            <MessageSquare size={13} /> Balas via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RFQPage() {
  const toast   = useToastCtx();
  const qc      = useQueryClient();
  const { page, limit, search, setPage, setSearch } = useTable();
  const [filter, setFilter] = useState('unread'); // 'unread' | 'all' | 'processed'
  const [selected, setSelected] = useState(null);
  const dSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['rfq', page, dSearch, filter],
    queryFn:  () =>
      svc.getAll({ page, limit, search: dSearch || undefined, filter }).then((r) => r.data),
    refetchInterval: 30_000,
  });

  const markReadMut = useMutation({
    mutationFn: (id) => svc.markRead(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['rfq'] }); qc.invalidateQueries({ queryKey: ['dashboard-metrics'] }); },
  });

  const markProcessedMut = useMutation({
    mutationFn: (id) => svc.markProcessed(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rfq'] });
      qc.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      toast.success('RFQ ditandai sudah diproses.');
    },
    onError: () => toast.error('Gagal memperbarui status.'),
  });

  const handleView = (row) => {
    setSelected(row);
    if (!row.is_read) markReadMut.mutate(row.id);
  };

  const COLUMNS = [
    {
      key: 'company_name',
      label: 'Perusahaan',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.is_read && (
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          )}
          <div>
            <p className="font-semibold text-obsidian-800 text-sm">{row.company_name}</p>
            <p className="text-xs text-obsidian-400">{row.contact_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'product_interest',
      label: 'Produk / Layanan',
      render: (row) => <span className="text-sm text-obsidian-600">{row.product_interest}</span>,
    },
    {
      key: 'phone',
      label: 'Telepon',
      render: (row) => <span className="text-sm font-mono text-obsidian-500">{row.phone || '-'}</span>,
    },
    {
      key: 'created_at',
      label: 'Waktu',
      render: (row) => <span className="text-xs text-obsidian-400">{formatDateTime(row.created_at)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge
          label={row.is_processed ? 'Diproses' : row.is_read ? 'Sudah Dibaca' : 'Baru'}
          variant={row.is_processed ? 'processed' : row.is_read ? 'active' : 'unread'}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleView(row)}
            className="btn btn-ghost btn-sm"
            title="Lihat detail"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => replyRFQ(row)}
            className="btn btn-primary btn-sm"
            title="Balas via WhatsApp"
          >
            <MessageSquare size={13} />
            <span className="hidden md:inline">WhatsApp</span>
          </button>
          {!row.is_processed && (
            <button
              onClick={() => markProcessedMut.mutate(row.id)}
              disabled={markProcessedMut.isPending}
              className="btn btn-ghost btn-sm text-emerald-600 hover:bg-emerald-50"
              title="Tandai sudah diproses"
            >
              <CheckCircle size={14} />
              <span className="hidden md:inline">Selesai</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  const TABS = [
    { value: 'unread',    label: 'Belum Dibaca' },
    { value: 'all',       label: 'Semua' },
    { value: 'processed', label: 'Sudah Diproses' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Request for Quotation (RFQ)"
        subtitle="Permintaan penawaran dari calon klien."
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-surface-border pb-0 -mb-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => { setFilter(t.value); setPage(1); }}
            className={`px-4 py-2.5 text-sm font-display font-medium border-b-2 transition-colors
              ${filter === t.value
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-obsidian-500 hover:text-obsidian-700'
              }`}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto pb-2">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Cari perusahaan..." />
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        data={data?.data?.items ?? []}
        loading={isLoading}
        total={data?.data?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        emptyNode={
          <EmptyState
            icon={FileText}
            title="Tidak ada RFQ"
            desc={filter === 'unread' ? 'Semua RFQ sudah dibaca.' : 'Belum ada permintaan penawaran.'}
          />
        }
      />

      {/* Detail Modal */}
      {selected && <RFQDetailModal rfq={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
