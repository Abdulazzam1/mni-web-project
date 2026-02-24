import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Star, X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as svc from '@/services/testimonialService';
import { SectionHeader, EmptyState, Badge } from '@/components/ui/index';
import DataTable from '@/components/ui/DataTable';
import { useToastCtx } from '@/components/ui/Toast';
import { useConfirmCtx } from '@/components/ui/Confirm';
import { useTable } from '@/hooks/useTable';
import { getErrorMsg } from '@/utils/helpers';
import { formatDateShort } from '@/utils/formatters';

function TestimonialModal({ item, onClose, onSave }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: item || { client_name: '', client_title: '', client_company: '', content: '', rating: 5 },
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-obsidian-900/50 backdrop-blur-sm" onClick={onClose}/>
      <form onSubmit={handleSubmit(onSave)} className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in" noValidate>
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="font-display font-semibold text-obsidian-800">{item ? 'Edit' : 'Tambah'} Testimoni</h3>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm"><X size={15}/></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div><label className="label">Nama Klien *</label>
            <input className={`input ${errors.client_name ? 'input-error' : ''}`} {...register('client_name', { required: true })}/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Jabatan</label><input className="input" {...register('client_title')}/></div>
            <div><label className="label">Perusahaan</label><input className="input" {...register('client_company')}/></div>
          </div>
          <div><label className="label">Rating (1-5)</label>
            <input type="number" min={1} max={5} className="input" {...register('rating', { min: 1, max: 5 })}/></div>
          <div><label className="label">Isi Testimoni *</label>
            <textarea className={`input ${errors.content ? 'input-error' : ''}`} rows={4} {...register('content', { required: true })}/></div>
        </div>
        <div className="px-6 py-4 border-t border-surface-border flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">Batal</button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-sm"><Save size={13}/>Simpan</button>
        </div>
      </form>
    </div>
  );
}

export default function TestimonialsPage() {
  const toast = useToastCtx(); const confirm = useConfirmCtx(); const qc = useQueryClient();
  const { page, limit, setPage } = useTable();
  const [modal, setModal] = useState(null); // null | 'create' | item object

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials', page], queryFn: () => svc.getAll({ page, limit }).then((r) => r.data),
  });

  const saveMut = useMutation({
    mutationFn: (d) => typeof modal === 'object' && modal?.id ? svc.update(modal.id, d) : svc.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials'] }); toast.success('Testimoni disimpan.'); setModal(null); },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => svc.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials'] }); toast.success('Testimoni dihapus.'); },
  });

  const COLUMNS = [
    { key: 'client_name', label: 'Klien', render: (row) => (
      <div><p className="font-medium text-obsidian-800">{row.client_name}</p>
        <p className="text-xs text-obsidian-400">{row.client_title} · {row.client_company}</p></div>
    )},
    { key: 'rating', label: 'Rating', render: (row) => (
      <div className="flex gap-0.5">
        {Array.from({ length: row.rating }).map((_, i) => <Star key={i} size={12} fill="#E8A020" className="text-amber-500"/>)}
      </div>
    )},
    { key: 'content', label: 'Testimoni', render: (row) => <span className="text-sm text-obsidian-500 line-clamp-2">{row.content}</span> },
    { key: 'created_at', label: 'Tanggal', render: (row) => <span className="text-xs text-obsidian-400">{formatDateShort(row.created_at)}</span> },
    { key: 'actions', label: '', align: 'right', render: (row) => (
      <div className="flex items-center justify-end gap-1.5">
        <button onClick={() => setModal(row)} className="btn btn-ghost btn-sm"><Pencil size={14}/></button>
        <button onClick={async () => { const ok = await confirm('Hapus testimoni ini?'); if (ok) deleteMut.mutate(row.id); }}
          className="btn btn-ghost btn-sm text-crimson-400 hover:bg-crimson-50"><Trash2 size={14}/></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Testimoni" subtitle="Ulasan dan kepuasan klien."
        actions={<button onClick={() => setModal('create')} className="btn btn-primary"><Plus size={16}/>Tambah Testimoni</button>}
      />
      <DataTable columns={COLUMNS} data={data?.data?.items ?? []} loading={isLoading}
        total={data?.data?.total ?? 0} page={page} limit={limit} onPageChange={setPage}
        emptyNode={<EmptyState icon={Star} title="Belum ada testimoni"
          action={<button onClick={() => setModal('create')} className="btn btn-primary btn-sm"><Plus size={14}/>Tambah</button>}/>}
      />
      {modal && (
        <TestimonialModal
          item={typeof modal === 'object' ? modal : null}
          onClose={() => setModal(null)}
          onSave={(d) => saveMut.mutate(d)}
        />
      )}
    </div>
  );
}
