import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, X, Plus } from 'lucide-react';
import * as svc from '@/services/productService';
import ImageUpload from '@/components/ui/ImageUpload';
import { Toggle, SectionHeader, PageSpinner } from '@/components/ui/index';
import { useToastCtx } from '@/components/ui/Toast';
import { getErrorMsg, slugify, PRODUCT_CATEGORIES } from '@/utils/helpers';
import { useState } from 'react';

export default function ProductFormPage() {
  const { id }   = useParams();
  const isEdit   = !!id;
  const navigate = useNavigate();
  const toast    = useToastCtx();
  const qc       = useQueryClient();

  // State untuk gambar (bisa multiple) & specs (key-value pairs)
  const [images, setImages]   = useState([null]);
  const [specs,  setSpecs]    = useState([{ key: '', value: '' }]);

  const { data: existing, isLoading: loadingData } = useQuery({
    queryKey: ['product', id],
    queryFn:  () => svc.getOne(id).then((r) => r.data.data),
    enabled:  isEdit,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '', brand: '', category: 'ac', description: '',
      is_featured: false, is_active: true,
    },
  });

  // Populate form saat edit
  useEffect(() => {
    if (existing) {
      Object.entries(existing).forEach(([k, v]) => setValue(k, v));
      if (existing.images?.length) {
        setImages(existing.images.map((i) => i || null));
      }
      if (existing.specs && Object.keys(existing.specs).length) {
        setSpecs(Object.entries(existing.specs).map(([k, v]) => ({ key: k, value: v })));
      }
    }
  }, [existing, setValue]);

  const mut = useMutation({
    mutationFn: (payload) => isEdit ? svc.update(id, payload) : svc.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success(isEdit ? 'Produk diperbarui.' : 'Produk berhasil ditambahkan.');
      navigate('/produk');
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const onSubmit = (data) => {
    const specsObj = {};
    specs.filter((s) => s.key.trim()).forEach((s) => { specsObj[s.key.trim()] = s.value; });
    mut.mutate({
      ...data,
      slug:   slugify(data.name),
      images: images.filter(Boolean),
      specs:  specsObj,
    });
  };

  const addSpec  = () => setSpecs((p) => [...p, { key: '', value: '' }]);
  const removeSpec = (i) => setSpecs((p) => p.filter((_, idx) => idx !== i));
  const updateSpec = (i, field, val) =>
    setSpecs((p) => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const addImage = () => setImages((p) => [...p, null]);
  const setImage = (i, path) => setImages((p) => p.map((v, idx) => idx === i ? path : v));
  const removeImage = (i) => setImages((p) => p.filter((_, idx) => idx !== i));

  if (isEdit && loadingData) return <PageSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in" noValidate>
      <SectionHeader
        title={isEdit ? 'Edit Produk' : 'Tambah Produk'}
        subtitle="Lengkapi informasi produk."
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate('/produk')} className="btn btn-outline">
              <ArrowLeft size={15} /> Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting
                ? <span className="w-4 h-4 border-2 border-navy-900/20 border-t-navy-900 rounded-full animate-spin" />
                : <Save size={15} />
              }
              Simpan
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5 space-y-4">
            <h3 className="font-display font-semibold text-obsidian-700 text-sm">Informasi Produk</h3>

            <div>
              <label className="label">Nama Produk *</label>
              <input className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="contoh: AC Split 1 PK Masagi"
                {...register('name', { required: 'Nama wajib diisi' })} />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Brand / Merek</label>
                <input className="input" placeholder="Masagi"
                  {...register('brand')} />
              </div>
              <div>
                <label className="label">Kategori *</label>
                <select className="input" {...register('category', { required: true })}>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Deskripsi</label>
              <textarea className="input" rows={4}
                placeholder="Deskripsikan produk secara singkat dan menarik..."
                {...register('description')} />
            </div>
          </div>

          {/* Specifications */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-obsidian-700 text-sm">Spesifikasi Teknis</h3>
              <button type="button" onClick={addSpec} className="btn btn-ghost btn-sm text-navy-600">
                <Plus size={13} /> Tambah
              </button>
            </div>
            <div className="space-y-2.5">
              {specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="input flex-1 text-sm"
                    placeholder="Kapasitas"
                    value={spec.key}
                    onChange={(e) => updateSpec(i, 'key', e.target.value)}
                  />
                  <input
                    className="input flex-1 text-sm"
                    placeholder="1 PK"
                    value={spec.value}
                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    disabled={specs.length === 1}
                    className="btn btn-ghost btn-sm text-crimson-400 hover:bg-crimson-50 disabled:opacity-30"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-obsidian-400">Contoh: Kapasitas | 1 PK · Freon | R32 · Daya | 780 Watt</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish settings */}
          <div className="card p-5 space-y-4">
            <h3 className="font-display font-semibold text-obsidian-700 text-sm">Pengaturan</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-surface-border">
                <div>
                  <p className="text-sm font-medium text-obsidian-700">Status Aktif</p>
                  <p className="text-xs text-obsidian-400">Tampilkan di website</p>
                </div>
                <Toggle
                  checked={watch('is_active')}
                  onChange={(v) => setValue('is_active', v)}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-obsidian-700">Produk Unggulan</p>
                  <p className="text-xs text-obsidian-400">Tampil di halaman utama</p>
                </div>
                <Toggle
                  checked={watch('is_featured')}
                  onChange={(v) => setValue('is_featured', v)}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-obsidian-700 text-sm">Gambar Produk</h3>
              {images.length < 4 && (
                <button type="button" onClick={addImage} className="btn btn-ghost btn-sm text-navy-600">
                  <Plus size={13} /> Tambah
                </button>
              )}
            </div>
            <div className="space-y-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <ImageUpload
                    value={img}
                    onChange={(path) => setImage(i, path)}
                    folder="products"
                    label={i === 0 ? 'Gambar Utama' : `Gambar ${i + 1}`}
                  />
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
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
      </div>
    </form>
  );
}
