import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Newspaper } from 'lucide-react';
import * as svc from '@/services/newsService';
import { SectionHeader, SearchInput, Badge, EmptyState, Toggle } from '@/components/ui/index';
import DataTable from '@/components/ui/DataTable';
import { useToastCtx } from '@/components/ui/Toast';
import { useConfirmCtx } from '@/components/ui/Confirm';
import { useTable } from '@/hooks/useTable';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateShort, imgUrl } from '@/utils/formatters';
import { NEWS_CATEGORIES } from '@/utils/helpers';

export default function NewsPage() {
  const navigate = useNavigate();
  const toast    = useToastCtx();
  const confirm  = useConfirmCtx();
  const qc       = useQueryClient();
  const { page, limit, search, setPage, setSearch } = useTable();
  const [cat, setCat] = useState('');
  const dSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['news', page, dSearch, cat],
    queryFn:  () => svc.getAll({ page, limit, search: dSearch || undefined, category: cat || undefined }).then((r) => r.data),
  });

  const toggleMut = useMutation({
    mutationFn: (id) => svc.toggle(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['news'] }); toast.success('Status artikel diperbarui.'); },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => svc.remove(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['news'] }); toast.success('Artikel dihapus.'); },
    onError:    () => toast.error('Gagal menghapus artikel.'),
  });

  const handleDelete = async (row) => {
    const ok = await confirm(`Hapus artikel "${row.title}"?`);
    if (ok) deleteMut.mutate(row.id);
  };

  const COLUMNS = [
    {
      key: 'cover',
      label: '',
      render: (row) => (
        <div className="w-14 h-10 rounded overflow-hidden bg-surface-hover shrink-0">
          {row.cover_image
            ? <img src={imgUrl(row.cover_image)} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Newspaper size={14} className="text-obsidian-300" /></div>
          }
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Judul',
      render: (row) => (
        <div>
          <p className="font-medium text-obsidian-800 line-clamp-1">{row.title}</p>
          <p className="text-xs text-obsidian-400">{row.author}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      render: (row) => <Badge label={row.category} variant={row.category} />,
    },
    {
      key: 'is_published',
      label: 'Tayang',
      render: (row) => (
        <Toggle
          checked={row.is_published}
          onChange={() => toggleMut.mutate(row.id)}
          disabled={toggleMut.isPending}
        />
      ),
    },
    {
      key: 'published_at',
      label: 'Tanggal',
      render: (row) => <span className="text-xs text-obsidian-400">{formatDateShort(row.published_at)}</span>,
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button onClick={() => navigate(`/berita/${row.id}/edit`)} className="btn btn-ghost btn-sm">
            <Pencil size={14} />
          </button>
          <button onClick={() => handleDelete(row)} className="btn btn-ghost btn-sm text-crimson-400 hover:bg-crimson-50">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Berita & Informasi"
        subtitle="Kelola artikel berita, aktivitas, dan CSR."
        actions={
          <button onClick={() => navigate('/berita/baru')} className="btn btn-primary">
            <Plus size={16} /> Tulis Artikel
          </button>
        }
      />
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Cari judul..." />
        <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="input w-auto text-sm">
          <option value="">Semua Kategori</option>
          {NEWS_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <DataTable
        columns={COLUMNS}
        data={data?.data?.items ?? []}
        loading={isLoading}
        total={data?.data?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
