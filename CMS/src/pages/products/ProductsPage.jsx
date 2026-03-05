import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import axios from 'axios'; // <-- TAMBAHAN: Untuk fetch kategori
import * as svc from '@/services/productService';
import { SectionHeader, SearchInput, Badge, EmptyState, PageSpinner } from '@/components/ui/index';
import DataTable from '@/components/ui/DataTable';
import { Toggle } from '@/components/ui/index';
import { useToastCtx } from '@/components/ui/Toast';
import { useConfirmCtx } from '@/components/ui/Confirm';
import { useTable } from '@/hooks/useTable';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateShort, imgUrl } from '@/utils/formatters';

export default function ProductsPage() {
  const navigate    = useNavigate();
  const toast       = useToastCtx();
  const confirm     = useConfirmCtx();
  const qc          = useQueryClient();
  const { page, limit, search, setPage, setSearch } = useTable();
  const [cat, setCat] = useState('');
  const dSearch = useDebounce(search);

  // FIX: Mengambil data kategori secara dinamis dari database
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const baseURL = import.meta.env.VITE_API_URL || '/api';
      const res = await axios.get(`${baseURL}/categories`);
      return res.data.data || [];
    }
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, dSearch, cat],
    queryFn: () =>
      svc.getAll({ page, limit, search: dSearch || undefined, category: cat || undefined })
         .then((r) => r.data),
  });

  const toggleMut = useMutation({
    mutationFn: (id) => svc.toggle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Status produk diperbarui.');
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id) => svc.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produk dihapus.');
    },
    onError: () => toast.error('Gagal menghapus produk.'),
  });

  const handleDelete = async (row) => {
    const ok = await confirm(`Hapus produk "${row.name}"? Aksi ini tidak bisa dibatalkan.`);
    if (ok) deleteMut.mutate(row.id);
  };

  const COLUMNS = [
    {
      key: 'image',
      label: '',
      render: (row) => (
        <div className="w-10 h-10 rounded-md overflow-hidden bg-surface-hover shrink-0">
          {row.images?.[0] ? (
            <img src={imgUrl(row.images[0])} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={16} className="text-obsidian-300" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Nama Produk',
      render: (row) => (
        <div>
          <p className="font-medium text-obsidian-800">{row.name}</p>
          <p className="text-xs text-obsidian-400">{row.brand || '-'}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      render: (row) => {
        // FIX: Mencari label kategori dari data dinamis
        const found = categories.find((c) => c.slug === row.category);
        return (
          <Badge
            label={found ? found.name : row.category}
            variant={row.category}
          />
        );
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => (
        <Toggle
          checked={row.is_active}
          onChange={() => toggleMut.mutate(row.id)}
          disabled={toggleMut.isPending}
        />
      ),
    },
    {
      key: 'is_featured',
      label: 'Unggulan',
      render: (row) => row.is_featured
        ? <span className="badge badge-amber">Unggulan</span>
        : <span className="text-obsidian-300 text-xs">—</span>,
    },
    {
      key: 'created_at',
      label: 'Dibuat',
      render: (row) => <span className="text-xs text-obsidian-400">{formatDateShort(row.created_at)}</span>,
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => navigate(`/produk/${row.id}/edit`)}
            className="btn btn-ghost btn-sm"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="btn btn-ghost btn-sm text-crimson-400 hover:bg-crimson-50 hover:text-crimson-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Produk"
        subtitle="Kelola katalog produk yang ditampilkan di website."
        actions={
          <button onClick={() => navigate('/produk/baru')} className="btn btn-primary">
            <Plus size={16} /> Tambah Produk
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Cari nama produk..."
        />
        
        {/* FIX: Dropdown Kategori sekarang dinamis dari API */}
        <select
          value={cat}
          onChange={(e) => { setCat(e.target.value); setPage(1); }}
          className="input w-auto text-sm"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
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
        emptyNode={
          <EmptyState
            icon={Package}
            title="Belum ada produk"
            desc="Tambahkan produk pertama Anda."
            action={
              <button onClick={() => navigate('/produk/baru')} className="btn btn-primary btn-sm">
                <Plus size={14} /> Tambah
              </button>
            }
          />
        }
      />
    </div>
  );
}