import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft } from 'lucide-react';
import * as svc from '@/services/serviceService';
import ImageUpload from '@/components/ui/ImageUpload';
import { SectionHeader, PageSpinner } from '@/components/ui/index';
import { useToastCtx } from '@/components/ui/Toast';
import { getErrorMsg, slugify } from '@/utils/helpers';

export default function ServiceFormPage() {
  const { id } = useParams(); const isEdit = !!id;
  const navigate = useNavigate(); const toast = useToastCtx(); const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['service', id], queryFn: () => svc.getOne(id).then((r) => r.data.data), enabled: isEdit,
  });

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: '', description: '', scope: '', icon: '', images: [] },
  });

  useEffect(() => { if (existing) Object.entries(existing).forEach(([k, v]) => setValue(k, v)); }, [existing, setValue]);

  const mut = useMutation({
    mutationFn: (d) => isEdit ? svc.update(id, d) : svc.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['services'] }); toast.success(isEdit ? 'Layanan diperbarui.' : 'Layanan ditambahkan.'); navigate('/layanan'); },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const onSubmit = (d) => mut.mutate({ ...d, slug: slugify(d.name) });

  if (isEdit && isLoading) return <PageSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in" noValidate>
      <SectionHeader title={isEdit ? 'Edit Layanan' : 'Tambah Layanan'} subtitle="Isi detail layanan yang ditawarkan."
        actions={<div className="flex gap-2">
          <button type="button" onClick={() => navigate('/layanan')} className="btn btn-outline"><ArrowLeft size={15}/>Batal</button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary"><Save size={15}/>Simpan</button>
        </div>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5 space-y-4">
          <div><label className="label">Nama Layanan *</label>
            <input className={`input ${errors.name ? 'input-error' : ''}`} {...register('name', { required: true })} /></div>
          <div><label className="label">Deskripsi</label>
            <textarea className="input" rows={4} {...register('description')} /></div>
          <div><label className="label">Ruang Lingkup Pekerjaan</label>
            <textarea className="input" rows={4} placeholder="Jelaskan cakupan pekerjaan..." {...register('scope')} /></div>
        </div>
        <div className="card p-5">
          <ImageUpload value={watch('images')?.[0]} onChange={(p) => setValue('images', [p])} folder="services" label="Gambar Layanan" />
        </div>
      </div>
    </form>
  );
}
