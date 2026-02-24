import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import * as svc from '@/services/portfolioService';
import ImageUpload from '@/components/ui/ImageUpload';
import { Toggle, SectionHeader, PageSpinner } from '@/components/ui/index';
import { useToastCtx } from '@/components/ui/Toast';
import { getErrorMsg, slugify } from '@/utils/helpers';

export default function PortfolioFormPage() {
  const { id } = useParams(); const isEdit = !!id;
  const navigate = useNavigate(); const toast = useToastCtx(); const qc = useQueryClient();
  const [images, setImages] = useState([null]);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['portfolio-item', id], queryFn: () => svc.getOne(id).then((r) => r.data.data), enabled: isEdit,
  });

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { title: '', client_name: '', client_logo: '', location: '', year: new Date().getFullYear(), scope: '', description: '', is_featured: false },
  });

  useEffect(() => {
    if (existing) {
      Object.entries(existing).forEach(([k, v]) => setValue(k, v));
      if (existing.images?.length) setImages(existing.images);
    }
  }, [existing, setValue]);

  const mut = useMutation({
    mutationFn: (d) => isEdit ? svc.update(id, d) : svc.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['portfolio'] }); toast.success(isEdit ? 'Portofolio diperbarui.' : 'Portofolio ditambahkan.'); navigate('/portfolio'); },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const onSubmit = (d) => mut.mutate({ ...d, slug: slugify(d.title), images: images.filter(Boolean) });

  if (isEdit && isLoading) return <PageSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in" noValidate>
      <SectionHeader title={isEdit ? 'Edit Portofolio' : 'Tambah Portofolio'} subtitle="Isi detail proyek."
        actions={<div className="flex gap-2">
          <button type="button" onClick={() => navigate('/portfolio')} className="btn btn-outline"><ArrowLeft size={15}/>Batal</button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary"><Save size={15}/>Simpan</button>
        </div>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5 space-y-4">
            <div><label className="label">Judul Proyek *</label>
              <input className={`input ${errors.title ? 'input-error' : ''}`} {...register('title', { required: true })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Nama Klien</label><input className="input" {...register('client_name')}/></div>
              <div><label className="label">Lokasi</label><input className="input" {...register('location')}/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Tahun</label><input type="number" className="input" {...register('year')}/></div>
            </div>
            <div><label className="label">Ruang Lingkup Pekerjaan</label>
              <textarea className="input" rows={3} {...register('scope')}/></div>
            <div><label className="label">Deskripsi</label>
              <textarea className="input" rows={4} {...register('description')}/></div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-obsidian-700">Unggulan</p>
              <Toggle checked={watch('is_featured')} onChange={(v) => setValue('is_featured', v)}/>
            </div>
          </div>
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="label mb-0">Foto Proyek</p>
              {images.length < 6 && (
                <button type="button" onClick={() => setImages((p) => [...p, null])} className="btn btn-ghost btn-sm text-navy-600">
                  <Plus size={13}/> Tambah
                </button>
              )}
            </div>
            {images.map((img, i) => (
              <div key={i} className="relative">
                <ImageUpload value={img} onChange={(p) => setImages((prev) => prev.map((v, idx) => idx === i ? p : v))}
                  folder="portfolio" label={i === 0 ? 'Foto Utama' : `Foto ${i + 1}`}/>
                {i > 0 && (
                  <button type="button" onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-crimson-500 text-white flex items-center justify-center">
                    <X size={10}/>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
