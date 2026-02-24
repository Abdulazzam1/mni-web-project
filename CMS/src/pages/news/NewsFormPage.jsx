import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft } from 'lucide-react';
import * as svc from '@/services/newsService';
import ImageUpload from '@/components/ui/ImageUpload';
import { Toggle, SectionHeader, PageSpinner } from '@/components/ui/index';
import { useToastCtx } from '@/components/ui/Toast';
import { getErrorMsg, slugify, NEWS_CATEGORIES } from '@/utils/helpers';

export default function NewsFormPage() {
  const { id }   = useParams();
  const isEdit   = !!id;
  const navigate = useNavigate();
  const toast    = useToastCtx();
  const qc       = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['news-item', id],
    queryFn:  () => svc.getOne(id).then((r) => r.data.data),
    enabled:  isEdit,
  });

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '', category: 'berita', excerpt: '', content: '',
      cover_image: '', author: 'Admin MNI', is_published: false,
    },
  });

  useEffect(() => {
    if (existing) {
      Object.entries(existing).forEach(([k, v]) => setValue(k, v));
    }
  }, [existing, setValue]);

  const mut = useMutation({
    mutationFn: (payload) => isEdit ? svc.update(id, payload) : svc.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['news'] });
      toast.success(isEdit ? 'Artikel diperbarui.' : 'Artikel berhasil diterbitkan.');
      navigate('/berita');
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const onSubmit = (data) =>
    mut.mutate({ ...data, slug: slugify(data.title) });

  if (isEdit && isLoading) return <PageSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in" noValidate>
      <SectionHeader
        title={isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
        subtitle="Isi konten berita, aktivitas, atau CSR."
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate('/berita')} className="btn btn-outline">
              <ArrowLeft size={15} /> Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting
                ? <span className="w-4 h-4 border-2 border-navy-900/20 border-t-navy-900 rounded-full animate-spin" />
                : <Save size={15} />
              }
              {watch('is_published') ? 'Terbitkan' : 'Simpan Draft'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5 space-y-4">
            <div>
              <label className="label">Judul Artikel *</label>
              <input className={`input ${errors.title ? 'input-error' : ''}`}
                placeholder="Tulis judul yang menarik..."
                {...register('title', { required: 'Judul wajib diisi' })} />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Kategori</label>
                <select className="input" {...register('category')}>
                  {NEWS_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Penulis</label>
                <input className="input" {...register('author')} />
              </div>
            </div>

            <div>
              <label className="label">Kutipan / Excerpt</label>
              <textarea className="input" rows={2}
                placeholder="Ringkasan singkat artikel (tampil di list berita)..."
                {...register('excerpt')} />
            </div>

            <div>
              <label className="label">Isi Artikel *</label>
              <textarea
                className={`input font-mono text-sm ${errors.content ? 'input-error' : ''}`}
                rows={16}
                placeholder="Tulis konten artikel di sini..."
                {...register('content', { required: 'Konten wajib diisi' })}
              />
              {errors.content && <p className="form-error">{errors.content.message}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish */}
          <div className="card p-5 space-y-4">
            <h3 className="font-display font-semibold text-obsidian-700 text-sm">Status Artikel</h3>

            <div className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-surface-border">
              <div>
                <p className="text-sm font-semibold text-obsidian-700">
                  {watch('is_published') ? '🟢 Tayang' : '⚪ Draft'}
                </p>
                <p className="text-xs text-obsidian-400 mt-0.5">
                  {watch('is_published') ? 'Terlihat di website' : 'Tersimpan sebagai draft'}
                </p>
              </div>
              <Toggle
                checked={watch('is_published')}
                onChange={(v) => setValue('is_published', v)}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="card p-5">
            <ImageUpload
              value={watch('cover_image')}
              onChange={(path) => setValue('cover_image', path)}
              folder="news"
              label="Gambar Cover"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
