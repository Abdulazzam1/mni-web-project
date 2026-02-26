import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/services/settingsService';
import styles from './SettingsPage.module.css'; // Opsional jika ingin styling terpisah

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    about_title: '', about_description: '', vision: '', mission: '',
    stats_projects: '', stats_clients: '', stats_years: '', stats_support: '',
    contact_sales: '', contact_service: '', contact_email: '', contact_address: '',
    operational_hours: '', social_instagram: '', social_linkedin: '', social_facebook: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getSettings();
      setFormData(res.data);
    } catch (err) {
      console.error("Gagal mengambil data pengaturan", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateSettings(formData);
      setStatus({ type: 'success', msg: 'Pengaturan berhasil diperbarui!' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Gagal memperbarui pengaturan.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Memuat pengaturan...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pengaturan Website</h1>
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

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bagian Kontak - Akan merubah Header & Footer */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-bottom pb-2">Informasi Kontak & Header</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">No. Telp Sales (Tampil di Header)</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.contact_sales}
                onChange={(e) => setFormData({...formData, contact_sales: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Telp Service</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.contact_service}
                onChange={(e) => setFormData({...formData, contact_service: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                className="form-control"
                value={formData.contact_email}
                onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Bagian Statistik - Tampil di About Page */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-bottom pb-2">Statistik Perusahaan (About Page)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Proyek</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.stats_projects}
                onChange={(e) => setFormData({...formData, stats_projects: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Klien</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.stats_clients}
                onChange={(e) => setFormData({...formData, stats_clients: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Bagian Konten Tentang Kami */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 border-bottom pb-2">Konten Tentang Kami</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Visi</label>
              <textarea 
                className="form-control"
                rows="2"
                value={formData.vision}
                onChange={(e) => setFormData({...formData, vision: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Misi (Pisahkan dengan ||)</label>
              <textarea 
                className="form-control"
                rows="4"
                value={formData.mission}
                onChange={(e) => setFormData({...formData, mission: e.target.value})}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}