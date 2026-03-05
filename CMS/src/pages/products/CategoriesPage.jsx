import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, X, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SectionHeader, PageSpinner } from '@/components/ui/index';
import { useToastCtx } from '@/components/ui/Toast';

export default function CategoriesPage() {
  const toast = useToastCtx();
  const qc = useQueryClient();
  const baseURL = import.meta.env.VITE_API_URL || '/api';

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');

  // Get Data Kategori
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/categories`);
      return res.data.data || [];
    }
  });

  // Setup Axios Headers (Ambil Token dari LocalStorage)
  const getAuthHeader = () => {
    const token = localStorage.getItem('mni_token'); // Sesuaikan key token Anda jika berbeda
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const mutAdd = useMutation({
    mutationFn: (payload) => axios.post(`${baseURL}/admin/categories`, payload, getAuthHeader()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori berhasil ditambahkan');
      resetForm();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menambahkan kategori')
  });

  const mutEdit = useMutation({
    mutationFn: ({ id, payload }) => axios.put(`${baseURL}/admin/categories/${id}`, payload, getAuthHeader()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori berhasil diperbarui');
      resetForm();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal memperbarui kategori')
  });

  const mutDel = useMutation({
    mutationFn: (id) => axios.delete(`${baseURL}/admin/categories/${id}`, getAuthHeader()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori berhasil dihapus');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menghapus kategori')
  });

  const resetForm = () => {
    setEditingId(null);
    setName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Nama kategori wajib diisi');

    if (editingId) {
      mutEdit.mutate({ id: editingId, payload: { name } });
    } else {
      mutAdd.mutate({ name });
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus kategori ini? Pastikan tidak ada produk yang sedang menggunakan kategori ini.')) {
      mutDel.mutate(id);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Manajemen Kategori"
        subtitle="Tambah, ubah, atau hapus kategori produk secara dinamis."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Form Input */}
        <div className="md:col-span-1 space-y-5">
          <form onSubmit={handleSubmit} className="card p-5 space-y-4 sticky top-24">
            <h3 className="font-display font-semibold text-obsidian-700 text-sm">
              {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </h3>
            <div>
              <label className="label">Nama Kategori</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Contoh: Water Cooled" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-outline flex-1">
                  <X size={15} /> Batal
                </button>
              )}
              <button type="submit" className="btn btn-primary flex-1" disabled={mutAdd.isPending || mutEdit.isPending}>
                <Save size={15} /> Simpan
              </button>
            </div>
          </form>
        </div>

        {/* Kolom Tabel Data */}
        <div className="md:col-span-2">
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-50 text-obsidian-500 font-medium border-b border-surface-border">
                <tr>
                  <th className="py-3 px-4">Nama Kategori</th>
                  <th className="py-3 px-4">Slug ID</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-obsidian-400">
                      Belum ada kategori yang ditambahkan.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-surface-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-obsidian-800">{cat.name}</td>
                      <td className="py-3 px-4 text-obsidian-500 font-mono text-xs">{cat.slug}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="btn btn-ghost btn-sm text-navy-600 hover:bg-navy-50"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="btn btn-ghost btn-sm text-crimson-500 hover:bg-crimson-50"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}