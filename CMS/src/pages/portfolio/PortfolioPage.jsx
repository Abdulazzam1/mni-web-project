import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import * as svc from '@/services/portfolioService';
import { SectionHeader, EmptyState, Badge } from '@/components/ui/index';
import DataTable from '@/components/ui/DataTable';
import { useToastCtx } from '@/components/ui/Toast';
import { useConfirmCtx } from '@/components/ui/Confirm';
import { useTable } from '@/hooks/useTable';
import { imgUrl } from '@/utils/formatters';
import { getErrorMsg } from '@/utils/helpers';

export default function PortfolioPage() {
  const navigate = useNavigate(); const toast = useToastCtx(); const confirm = useConfirmCtx(); const qc = useQueryClient();
  const { page, limit, setPage } = useTable();

  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', page],
    queryFn: () => svc.getAll({ page, limit }).then((r) => r.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => svc.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['portfolio'] }); toast.success('Portofolio dihapus.'); },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const COLUMNS = [
    { key: 'img', label: '', render: (row) => (
      <div className="w-16 h-10 rounded overflow-hidden bg-navy-900">
        {row.images?.[0] ? <img src={imgUrl(row.images[0])} alt="" className="w-full h-full object-cover" /> : null}
      </div>
    )},
    { key: 'title', label: 'Proyek', render: (row) => (
      <div><p className="font-medium text-obsidian-800">{row.title}</p>
        <p className="text-xs text-obsidian-400">{row.client_name}</p></div>
    )},
    { key: 'location', label: 'Lokasi', render: (row) => <span className="text-sm text-obsidian-500">{row.location || '-'}</span> },
    { key: 'year', label: 'Tahun', render: (row) => <span className="text-sm text-obsidian-600">{row.year || '-'}</span> },
    { key: 'is_featured', label: 'Unggulan', render: (row) => row.is_featured
      ? <Badge label="Unggulan" variant="unread" />
      : <span className="text-obsidian-300 text-xs">—</span> },
    { key: 'actions', label: '', align: 'right', render: (row) => (
      <div className="flex items-center justify-end gap-1.5">
        <button onClick={() => navigate(`/portfolio/${row.id}/edit`)} className="btn btn-ghost btn-sm"><Pencil size={14}/></button>
        <button onClick={async () => { const ok = await confirm(`Hapus portofolio "${row.title}"?`); if (ok) deleteMut.mutate(row.id); }}
          className="btn btn-ghost btn-sm text-crimson-400 hover:bg-crimson-50"><Trash2 size={14}/></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Portfolio" subtitle="Daftar proyek yang telah diselesaikan."
        actions={<button onClick={() => navigate('/portfolio/baru')} className="btn btn-primary"><Plus size={16}/>Tambah Proyek</button>}
      />
      <DataTable columns={COLUMNS} data={data?.data?.items ?? []} loading={isLoading}
        total={data?.data?.total ?? 0} page={page} limit={limit} onPageChange={setPage}
        emptyNode={<EmptyState icon={Image} title="Belum ada portofolio"
          action={<button onClick={() => navigate('/portfolio/baru')} className="btn btn-primary btn-sm"><Plus size={14}/>Tambah</button>}/>}
      />
    </div>
  );
}
