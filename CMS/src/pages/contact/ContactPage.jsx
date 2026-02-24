import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Eye } from 'lucide-react';
import * as svc from '@/services/contactService';
import { SectionHeader, Badge, EmptyState, SearchInput } from '@/components/ui/index';
import DataTable from '@/components/ui/DataTable';
import { useToastCtx } from '@/components/ui/Toast';
import { useTable } from '@/hooks/useTable';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateTime } from '@/utils/formatters';
import { replyContact } from '@/utils/whatsapp';

function ContactDetailModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-obsidian-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg animate-fade-in">
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="font-display font-semibold text-obsidian-800">Detail Pesan #{item.id}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {[
            { l: 'Nama',    v: item.name },
            { l: 'Email',   v: item.email },
            { l: 'Telepon', v: item.phone || '-' },
            { l: 'Subjek',  v: item.subject || '-' },
            { l: 'Waktu',   v: formatDateTime(item.created_at) },
          ].map(({ l, v }) => (
            <div key={l} className="grid grid-cols-[100px_1fr] gap-2 text-sm">
              <span className="text-obsidian-400 font-medium">{l}</span>
              <span className="text-obsidian-800">{v}</span>
            </div>
          ))}
          {item.message && (
            <div className="mt-2 pt-3 border-t border-surface-border">
              <p className="text-xs text-obsidian-400 mb-1.5 font-medium uppercase tracking-wider">Pesan</p>
              <p className="text-sm text-obsidian-700 leading-relaxed whitespace-pre-line">{item.message}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-surface-border flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-outline btn-sm">Tutup</button>
          {item.phone && (
            <button onClick={() => replyContact(item)} className="btn btn-primary btn-sm">
              <MessageSquare size={13} /> Balas WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const qc      = useQueryClient();
  const { page, limit, search, setPage, setSearch } = useTable();
  const [filter, setFilter] = useState('unread');
  const [selected, setSelected] = useState(null);
  const dSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['contact', page, dSearch, filter],
    queryFn:  () => svc.getAll({ page, limit, search: dSearch || undefined, filter }).then((r) => r.data),
    refetchInterval: 30_000,
  });

  const markReadMut = useMutation({
    mutationFn: (id) => svc.markRead(id),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['contact'] });
      qc.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
  });

  const handleView = (row) => {
    setSelected(row);
    if (!row.is_read) markReadMut.mutate(row.id);
  };

  const COLUMNS = [
    {
      key: 'name',
      label: 'Nama',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.is_read && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
          <div>
            <p className="font-semibold text-obsidian-800 text-sm">{row.name}</p>
            <p className="text-xs text-obsidian-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subjek',
      render: (row) => (
        <span className="text-sm text-obsidian-600 line-clamp-1">{row.subject || '-'}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Waktu',
      render: (row) => <span className="text-xs text-obsidian-400">{formatDateTime(row.created_at)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge label={row.is_read ? 'Dibaca' : 'Baru'} variant={row.is_read ? 'active' : 'unread'} />,
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button onClick={() => handleView(row)} className="btn btn-ghost btn-sm">
            <Eye size={14} />
          </button>
          {row.phone && (
            <button onClick={() => replyContact(row)} className="btn btn-primary btn-sm">
              <MessageSquare size={13} />
              <span className="hidden md:inline">WhatsApp</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Kotak Pesan"
        subtitle="Pesan dari form kontak website."
      />

      <div className="flex items-center gap-1 border-b border-surface-border pb-0 -mb-1">
        {[
          { value: 'unread', label: 'Belum Dibaca' },
          { value: 'all',    label: 'Semua' },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => { setFilter(t.value); setPage(1); }}
            className={`px-4 py-2.5 text-sm font-display font-medium border-b-2 transition-colors
              ${filter === t.value
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-obsidian-500 hover:text-obsidian-700'}`}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto pb-2">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Cari nama..." />
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
        emptyNode={<EmptyState icon={MessageSquare} title="Tidak ada pesan" desc="Kotak pesan kosong." />}
      />

      {selected && <ContactDetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
