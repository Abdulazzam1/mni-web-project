// CMS/src/pages/portfolio/PortfolioFormPage.jsx
// FIXED — 3 bug diperbaiki:
//
// BUG 1 [onSuccess]: invalidateQueries(['portfolio']) TIDAK match
//   ['portfolio-item', id] karena prefix 'portfolio' ≠ 'portfolio-item'.
//   Fix: tambah removeQueries({ queryKey: ['portfolio-item', id] }).
//
// BUG 2 [useEffect]: tanpa guard, useEffect re-run setiap background
//   refetch → description & images ditimpa nilai DB, menghapus input user.
//   Fix: hasInitialized ref → form hanya diisi SEKALI.
//   Fix tambahan: staleTime: Infinity + refetchOnWindowFocus: false
//   pada query ini agar tidak ada background refetch sama sekali.
//
// BUG 3 [stale closure]: onSubmit capture 'description' dari closure saat
//   React belum re-render (Quill onChange async). Nilai lama terkirim ke BE.
//   Fix: descriptionRef selalu up-to-date, onSubmit pakai ref bukan state.
//
// BONUS: useMemo dihapus (imported tapi tidak dipakai), setValue diganti
//   reset() agar semua field di-set secara atomik.

import { useEffect, useState, useRef } from 'react'; // hapus useMemo
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import * as svc from '@/services/portfolioService';
import ImageUpload from '@/components/ui/ImageUpload';
import { Toggle, SectionHeader, PageSpinner } from '@/components/ui/index';
import { useToastCtx } from '@/components/ui/Toast';
import { getErrorMsg, slugify } from '@/utils/helpers';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'link',
];

// Nilai awal form — didefinisikan di luar komponen agar referensinya stabil
const DEFAULT_VALUES = {
  title: '', client_name: '', client_logo: '', location: '',
  year: new Date().getFullYear(), scope: '', is_featured: false,
};

export default function PortfolioFormPage() {
  const { id }     = useParams();
  const isEdit     = !!id;
  const navigate   = useNavigate();
  const toast      = useToastCtx();
  const qc         = useQueryClient();

  const [images, setImages]         = useState([null]);
  const [description, setDescription] = useState('');

  // ─── FIX BUG 2: ref agar form hanya di-init SEKALI ─────────────────
  const hasInitialized = useRef(false);

  // ─── FIX BUG 3: ref agar onSubmit selalu pakai nilai description terbaru
  const descriptionRef = useRef('');

  // ─── FIX BUG 2: staleTime Infinity → tidak ada background refetch
  //   saat user sedang mengisi form. gcTime 0 → cache langsung hilang
  //   saat navigasi ke halaman lain, sehingga kunjungan berikutnya
  //   selalu fetch fresh dari server.
  const { data: existing, isLoading } = useQuery({
    queryKey: ['portfolio-item', id],
    queryFn:  () => svc.getOne(id).then((r) => r.data.data),
    enabled:  isEdit,
    staleTime: Infinity,          // FIX BUG 2: jangan pernah refetch otomatis
    gcTime:    0,                 // FIX BUG 2: hapus cache setelah unmount
    refetchOnWindowFocus: false,  // FIX BUG 2: double guard
  });

  // Gunakan reset() dari useForm agar semua field di-set atomik
  const {
    register,
    handleSubmit,
    reset,      // ← ganti setValue per-field dengan reset()
    setValue,   // masih dipakai untuk Toggle is_featured
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  // ─── FIX BUG 2: inisialisasi form hanya SEKALI ─────────────────────
  useEffect(() => {
    // Lewati jika: data belum ada ATAU sudah pernah diinit
    if (!existing || hasInitialized.current) return;

    hasInitialized.current = true;

    // Reset semua field sekaligus (atomik, lebih reliable dari setValue per-field)
    reset({
      title:       existing.title       ?? '',
      client_name: existing.client_name ?? '',
      client_logo: existing.client_logo ?? '',
      location:    existing.location    ?? '',
      year:        existing.year        ?? new Date().getFullYear(),
      scope:       existing.scope       ?? '',
      is_featured: existing.is_featured ?? false,
    });

    // Set description ke state DAN ref
    const desc = existing.description || '';
    setDescription(desc);
    descriptionRef.current = desc; // FIX BUG 3: sync ref

    // Set images
    if (Array.isArray(existing.images) && existing.images.length > 0) {
      setImages(existing.images);
    }
  }, [existing, reset]); // reset stabil, existing hanya berubah sekali (staleTime: Infinity)

  // ─── FIX BUG 1 onSuccess: hapus cache item yang baru disimpan ──────
  const mut = useMutation({
    mutationFn: (d) => isEdit ? svc.update(id, d) : svc.create(d),
    onSuccess: () => {
      // Invalidate list portfolio (query yang tampil di halaman daftar)
      qc.invalidateQueries({ queryKey: ['portfolio'] });

      // FIX BUG 1: hapus secara eksplisit cache item yang baru diedit.
      // Ini yang menyebabkan "FE update tapi CMS masih lama":
      // invalidateQueries(['portfolio']) tidak menyentuh ['portfolio-item', id]
      // karena prefix 'portfolio' ≠ 'portfolio-item'.
      if (isEdit) {
        qc.removeQueries({ queryKey: ['portfolio-item', id] });
      }

      toast.success(isEdit ? 'Portofolio diperbarui.' : 'Portofolio ditambahkan.');
      navigate('/portfolio');
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  // ─── FIX BUG 3: handler Quill update KEDUANYA (state + ref) ────────
  const handleDescriptionChange = (value) => {
    descriptionRef.current = value; // langsung — tidak tunggu re-render
    setDescription(value);          // untuk tampilan controlled component
  };

  // ─── FIX BUG 3: onSubmit pakai ref, bukan state ─────────────────────
  const onSubmit = (d) => {
    mut.mutate({
      ...d,
      slug:        slugify(d.title),
      description: descriptionRef.current, // SELALU nilai terbaru
      images:      images.filter(Boolean),
    });
  };

  if (isEdit && isLoading) return <PageSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in" noValidate>
      <SectionHeader
        title={isEdit ? 'Edit Portofolio' : 'Tambah Portofolio'}
        subtitle="Isi detail proyek."
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate('/portfolio')} className="btn btn-outline">
              <ArrowLeft size={15} /> Batal
            </button>
            <button type="submit" disabled={isSubmitting || mut.isPending} className="btn btn-primary">
              <Save size={15} /> {mut.isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Kolom Utama ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5 space-y-4">

            {/* Judul */}
            <div>
              <label className="label">Judul Proyek *</label>
              <input
                className={`input ${errors.title ? 'input-error' : ''}`}
                {...register('title', { required: 'Judul wajib diisi.' })}
              />
              {errors.title && (
                <p className="text-xs text-crimson-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Klien & Lokasi */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nama Klien</label>
                <input className="input" {...register('client_name')} />
              </div>
              <div>
                <label className="label">Lokasi</label>
                <input className="input" {...register('location')} />
              </div>
            </div>

            {/* Tahun */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Tahun</label>
                <input type="number" className="input" {...register('year')} />
              </div>
            </div>

            {/* Ruang Lingkup */}
            <div>
              <label className="label">Ruang Lingkup Pekerjaan</label>
              <textarea className="input" rows={3} {...register('scope')} />
            </div>

            {/* Deskripsi — Rich Text Editor */}
            <div>
              <label className="label">
                Deskripsi Proyek
                <span className="ml-2 text-[10px] text-obsidian-400 font-normal normal-case">
                  (tebal, miring, bullet, numbering)
                </span>
              </label>
              <div className="rounded-lg overflow-hidden border border-surface-border">
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={handleDescriptionChange} 
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Tulis deskripsi detail proyek di sini..."
                  style={{ minHeight: '220px' }}
                />
              </div>
              <p className="text-[10px] text-obsidian-400 mt-1">
                HTML dari editor ini akan dirender langsung di halaman publik.
              </p>
            </div>
          </div>
        </div>

        {/* ── Kolom Sidebar ── */}
        <div className="space-y-5">
          {/* Toggle Unggulan */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-obsidian-700">Unggulan</p>
              <Toggle
                checked={watch('is_featured')}
                onChange={(v) => setValue('is_featured', v)}
              />
            </div>
          </div>

          {/* Foto Proyek */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="label mb-0">Foto Proyek</p>
              {images.length < 6 && (
                <button
                  type="button"
                  onClick={() => setImages((p) => [...p, null])}
                  className="btn btn-ghost btn-sm text-navy-600"
                >
                  <Plus size={13} /> Tambah
                </button>
              )}
            </div>
            {images.map((img, i) => (
              <div key={i} className="relative">
                <ImageUpload
                  value={img}
                  onChange={(p) =>
                    setImages((prev) => prev.map((v, idx) => (idx === i ? p : v)))
                  }
                  folder="portfolio"
                  label={i === 0 ? 'Foto Utama' : `Foto ${i + 1}`}
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-crimson-500 text-white flex items-center justify-center"
                  >
                    <X size={10} />
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