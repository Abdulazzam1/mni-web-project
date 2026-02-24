import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '@/services/uploadService';
import { imgUrl } from '@/utils/formatters';
import { useToastCtx } from './Toast';

/**
 * Inline image uploader dengan preview langsung.
 * @prop {string|null}  value    - path gambar saat ini (dari DB)
 * @prop {(path)=>void} onChange - callback saat gambar baru diupload
 * @prop {string}       folder   - subfolder upload (products, news, dll)
 * @prop {string}       label
 */
export default function ImageUpload({
  value,
  onChange,
  folder = 'misc',
  label = 'Gambar',
  accept = 'image/jpeg,image/png,image/webp',
}) {
  const toast      = useToastCtx();
  const inputRef   = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // local blob URL

  const currentSrc = preview || imgUrl(value);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5 MB.');
      return;
    }
    // Tampilkan preview lokal segera
    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);
    setLoading(true);
    try {
      const result = await uploadImage(file, folder);
      onChange(result.path); // simpan path relatif ke form
      toast.success('Gambar berhasil diupload.');
    } catch {
      toast.error('Gagal upload gambar. Coba lagi.');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {label && <label className="label">{label}</label>}

      {currentSrc ? (
        /* Preview */
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-surface-border bg-surface group">
          <img src={currentSrc} alt="preview" className="w-full h-full object-cover" />
          {loading && (
            <div className="absolute inset-0 bg-obsidian-900/50 flex items-center justify-center">
              <Loader2 size={28} className="text-white animate-spin" />
            </div>
          )}
          {!loading && (
            <div className="absolute inset-0 bg-obsidian-900/0 group-hover:bg-obsidian-900/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="btn btn-primary btn-sm"
              >
                <Upload size={13} /> Ganti
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-danger btn-sm"
              >
                <X size={13} /> Hapus
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Drop Zone */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 w-full aspect-video rounded-lg
                     border-2 border-dashed border-surface-border bg-surface cursor-pointer
                     hover:border-amber-400 hover:bg-amber-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-surface-border flex items-center justify-center">
            <ImageIcon size={20} className="text-obsidian-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-obsidian-600">Klik untuk upload</p>
            <p className="text-xs text-obsidian-400 mt-0.5">atau drag & drop di sini</p>
            <p className="text-xs text-obsidian-300 mt-1">JPG, PNG, WebP · Maks. 5 MB</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}
