import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/services/settingsService';
import { Plus, Trash2, Upload } from 'lucide-react';
import { imgUrl } from '@/utils/formatters';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    about_title: '', about_description: '', vision: '', mission: '',
    stats_projects: '', stats_clients: '', stats_years: '', stats_support: '',
    contact_sales: '', contact_service: '', contact_email: '', contact_address: '',
    operational_hours: '', social_instagram: '', social_linkedin: '', social_facebook: '',
    about_image: '',
    company_values: [] // State untuk editor nilai-nilai
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getSettings();
      const data = res.data;
      
      // Sinkronisasi data JSON company_values dari backend
      if (typeof data.company_values === 'string') {
        data.company_values = JSON.parse(data.company_values);
      }
      
      setFormData({ ...data, company_values: data.company_values || [] });
      
      // Set pratinjau gambar jika path tersedia di database
      if (data.about_image) {
        setImagePreview(imgUrl(data.about_image));
      }
    } catch (err) {
      console.error("Gagal mengambil data pengaturan", err);
    } finally {
      setLoading(false);
    }
  };

  // Handler Editor Nilai-Nilai
  const addValue = () => {
    setFormData({
      ...formData,
      company_values: [...formData.company_values, { title: '', desc: '' }]
    });
  };

  const removeValue = (index) => {
    const newValues = formData.company_values.filter((_, i) => i !== index);
    setFormData({ ...formData, company_values: newValues });
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...formData.company_values];
    newValues[index][field] = value;
    setFormData({ ...formData, company_values: newValues });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Membuat preview lokal
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      // FIX: Menggunakan FormData untuk mendukung pengiriman file dan JSON stringified
      const data = new FormData();
      
      // Iterasi semua field di formData
      Object.keys(formData).forEach(key => {
        if (key === 'company_values') {
          // Kirim array sebagai string JSON agar terbaca di backend
          data.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'about_image') {
          // Append semua field teks kecuali path image lama
          data.append(key, formData[key]);
        }
      });

      // Append file gambar baru jika user telah memilih file baru
      if (imageFile) {
        data.append('about_image', imageFile);
      } else {
        // Jika tidak ada file baru, kirim path lama agar data di database tidak terhapus
        data.append('about_image', formData.about_image);
      }

      await updateSettings(data);
      setStatus({ type: 'success', msg: 'Pengaturan berhasil diperbarui!' });
      
      // Refresh data untuk mensinkronkan state dengan database terbaru
      fetchData();
    } catch (err) {
      console.error("Gagal memperbarui pengaturan:", err);
      setStatus({ type: 'error', msg: 'Gagal memperbarui pengaturan.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat pengaturan...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Pengaturan Website</h1>
        <button 
          onClick={handleSubmit}
          className="btn btn-primary" 
          disabled={saving}
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {status && (
        <div className={`p-4 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status.msg}
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
        {/* Kolom Kiri: Kontak & Gambar */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Informasi Kontak & Header</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">No. Telp Sales</label>
                <input type="text" className="form-control" value={formData.contact_sales} onChange={(e) => setFormData({...formData, contact_sales: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="form-control" value={formData.contact_email} onChange={(e) => setFormData({...formData, contact_email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jam Operasional</label>
                <input type="text" className="form-control" value={formData.operational_hours} onChange={(e) => setFormData({...formData, operational_hours: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Gambar Tentang Kami</h2>
            <div className="flex flex-col items-center gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded border border-gray-200 shadow-inner" />
              )}
              <label className="btn btn-outline w-full flex items-center justify-center gap-2 cursor-pointer transition-all">
                <Upload size={16} /> Pilih Gambar Baru
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              <p className="text-[10px] text-gray-400 italic">*Direkomendasikan rasio 4:3 atau 16:9</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Statistik & Nilai-Nilai */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Statistik Perusahaan (About Page)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Total Proyek</label>
                <input type="text" className="form-control" value={formData.stats_projects} onChange={(e) => setFormData({...formData, stats_projects: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Klien</label>
                <input type="text" className="form-control" value={formData.stats_clients} onChange={(e) => setFormData({...formData, stats_clients: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tahun Pengalaman</label>
                <input type="text" className="form-control" value={formData.stats_years} onChange={(e) => setFormData({...formData, stats_years: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Support Layanan</label>
                <input type="text" className="form-control" value={formData.stats_support} onChange={(e) => setFormData({...formData, stats_support: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Prinsip & Nilai Kami</h2>
            <div className="space-y-4">
              {formData.company_values.map((val, idx) => (
                <div key={idx} className="p-3 border border-gray-200 rounded-md relative bg-gray-50/50">
                  <button type="button" onClick={() => removeValue(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-2">
                    <input 
                      placeholder="Judul Nilai (Contoh: Integritas)" 
                      className="form-control text-sm font-bold bg-white" 
                      value={val.title} 
                      onChange={(e) => handleValueChange(idx, 'title', e.target.value)} 
                    />
                    <textarea 
                      placeholder="Deskripsi singkat mengenai prinsip ini" 
                      className="form-control text-sm bg-white" 
                      rows="2" 
                      value={val.desc} 
                      onChange={(e) => handleValueChange(idx, 'desc', e.target.value)} 
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addValue} className="btn btn-outline w-full text-sm flex items-center justify-center gap-2 border-dashed border-2">
                <Plus size={14} /> Tambah Nilai Baru
              </button>
            </div>
          </div>
        </div>

        {/* Visi, Misi & Alamat */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Konten Profil & Alamat</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul Utama Profil</label>
                <input type="text" className="form-control" value={formData.about_title} onChange={(e) => setFormData({...formData, about_title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi Tentang Kami (Gunakan || untuk paragraf baru)</label>
                <textarea className="form-control" rows="5" value={formData.about_description} onChange={(e) => setFormData({...formData, about_description: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Visi</label>
                  <textarea className="form-control" rows="3" value={formData.vision} onChange={(e) => setFormData({...formData, vision: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Misi (Gunakan || untuk poin baru)</label>
                  <textarea className="form-control" rows="3" value={formData.mission} onChange={(e) => setFormData({...formData, mission: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat Kantor Lengkap</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  value={formData.contact_address} 
                  onChange={(e) => setFormData({...formData, contact_address: e.target.value})} 
                />
                
                {/* PRATINJAU PETA DINAMIS DI CMS */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2 text-gray-500 italic">Pratinjau Lokasi Peta:</label>
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <iframe
                      title="Preview Map"
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(formData.contact_address || 'Jakarta')}&output=embed`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}