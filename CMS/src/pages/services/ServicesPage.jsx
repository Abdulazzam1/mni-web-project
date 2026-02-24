import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react';
import * as svc from '@/services/serviceService';
import { SectionHeader, EmptyState } from '@/components/ui/index';
import DataTable from '@/components/ui/DataTable';
import { useToastCtx } from '@/components/ui/Toast';
import { useConfirmCtx } from '@/components/ui/Confirm';
import { useTable } from '@/hooks/useTable';
import { formatDateShort } from '@/utils/formatters';
import { getErrorMsg } from '@/utils/helpers';

export default function ServicesPage() {
  const navigate = useNavigate();
  const toast    = useToastCtx();
  const confirm  = useConfirmCtx();
  const qc       = useQueryClient();
  const { page, limit, setPage } = useTable();

  const { data, isLoading } = useQuery({
    queryKey: ['services', page],
    queryFn:  () => svc.getAll({ page, limit }).then((r) => r.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => svc.remove(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['services'] }); toast.success('Layanan dihapus.'); },
    onError:    (err) => toast.error(getErrorMsg(err)),
  });

  const COLUMNS = [
    { key: 'name',  label: 'Nama Layanan', render: (row) => <span className="font-medium text-obsidian-800">{row.name}</span> },
    { key: 'scope', label: 'Ruang Lingkup', render: (row) => <span className="text-sm text-obsidian-500 line-clamp-1">{row.scope || '-'}</span> },
    { key: 'created_at', label: 'Dibuat', render: (row) => <span className="text-xs text-obsidian-400">{formatDateShort(row.created_at)}</span> },
    {
      key: 'actions', label: '', align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button onClick={() => navigate(`/layanan/${row.id}/edit`)} className="btn btn-ghost btn-sm"><Pencil size={14} /></button>
          <button onClick={async () => { const ok = await confirm(`Hapus layanan "${row.name}"?`); if (ok) deleteMut.mutate(row.id); }}
            className="btn btn-ghost btn-sm text-crimson-400 hover:bg-crimson-50"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Layanan" subtitle="Kelola jasa yang ditawarkan perusahaan."
        actions={<button onClick={() => navigate('/layanan/baru')} className="btn btn-primary"><Plus size={16} /> Tambah Layanan</button>}
      />
      <DataTable columns={COLUMNS} data={data?.data?.items ?? []} loading={isLoading}
        total={data?.data?.total ?? 0} page={page} limit={limit} onPageChange={setPage}
        emptyNode={<EmptyState icon={Wrench} title="Belum ada layanan"
          action={<button onClick={() => navigate('/layanan/baru')} className="btn btn-primary btn-sm"><Plus size={14}/>Tambah</button>} />}
      />
    </div>
  );
}
