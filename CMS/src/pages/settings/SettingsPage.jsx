// CMS/src/pages/settings/SettingsPage.jsx
// REVISI TAHAP 5: Tambahkan Dynamic Form "Contact Persons" —
// admin bisa add/edit/hapus daftar {name, role, wa} secara dinamis.
// Semua kode existing (company_values, sosmed, dll) dipertahankan.

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/services/settingsService';
import {
  Plus, Trash2, Upload, Link as LinkIcon,
  Instagram, Linkedin, Facebook, Phone,
} from 'lucide-react';
import { imgUrl } from '@/utils/formatters';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    about_title: '', about_description: '', vision: '', mission: '',
    stats_projects: '', stats_clients: '', stats_years: '', stats_support: '',
    contact_sales: '', contact_service: '', contact_email: '', contact_address: '',
    operational_hours: '',
    social_instagram: '', social_linkedin: '', social_facebook: '',
    about_image: '',
    compro_file: '',
    company_values:   [],
    contact_persons:  [],   // ← TAHAP 5
  });

  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [status,       setStatus]       = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res  = await getSettings();
      const data = res.data;

      // Parse JSONB fields
      if (typeof data.company_values === 'string')
        data.company_values = JSON.parse(data.company_values || '[]');
      if (typeof data.contact_persons === 'string')
        data.contact_persons = JSON.parse(data.contact_persons || '[]');

      setFormData({
        ...data,
        company_values:  data.company_values  || [],
        contact_persons: data.contact_persons || [],
      });

      if (data.about_image) setImagePreview(imgUrl(data.about_image));
    } catch (err) {
      console.error('Gagal mengambil data pengaturan', err);
    } finally {
      setLoading(false);
    }
  };

  /* ── company_values helpers ── */
  const addValue = () =>
    setFormData((f) => ({ ...f, company_values: [...f.company_values, { title: '', desc: '' }] }));
  const removeValue = (i) =>
    setFormData((f) => ({ ...f, company_values: f.company_values.filter((_, idx) => idx !== i) }));
  const changeValue = (i, field, val) => {
    setFormData((f) => {
      const arr = [...f.company_values];
      arr[i] = { ...arr[i], [field]: val };
      return { ...f, company_values: arr };
    });
  };

  /* ── TAHAP 5: contact_persons helpers ── */
  const addPerson = () =>
    setFormData((f) => ({ ...f, contact_persons: [...f.contact_persons, { name: '', role: '', wa: '' }] }));
  const removePerson = (i) =>
    setFormData((f) => ({ ...f, contact_persons: f.contact_persons.filter((_, idx) => idx !== i) }));
  const changePerson = (i, field, val) => {
    setFormData((f) => {
      const arr = [...f.contact_persons];
      arr[i] = { ...arr[i], [field]: val };
      return { ...f, contact_persons: arr };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const fd = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === 'company_values' || key === 'contact_persons') {
          fd.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'about_image') {
          fd.append(key, formData[key] === null ? '' : formData[key]);
        }
      });

      if (imageFile) {
        fd.append('about_image', imageFile);
      } else {
        fd.append('about_image', formData.about_image || '');
      }

      await updateSettings(fd);
      setStatus({ type: 'success', msg: 'Pengaturan berhasil diperbarui!' });
      fetchData();
    } catch (err) {
      console.error('Gagal memperbarui pengaturan:', err);
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
        <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {status && (
        <div className={`p-4 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status.msg}
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>

        {/* ══════════ KOLOM KIRI ══════════ */}
        <div className="space-y-8">

          {/* Kontak Dasar */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Informasi Kontak Utama</h2>
            <div className="space-y-4">
              {[
                ['contact_sales',    'No. Telp Sales (Fallback)'],
                ['contact_service',  'No. Telp Service (Fallback)'],
                ['contact_email',    'Email'],
                ['operational_hours','Jam Operasional'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ─── TAHAP 5: Contact Persons ─── */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-1 border-b pb-2 text-navy-800">
              Daftar Kontak Person (Footer)
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Tampil di Footer website. Format nomor WA: <code>628xxxxxxx</code> (tanpa +).
            </p>
            <div className="space-y-3">
              {formData.contact_persons.map((person, idx) => (
                <div key={idx} className="relative p-3 border border-gray-200 rounded-md bg-gray-50">
                  <button
                    type="button"
                    onClick={() => removePerson(idx)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-1 gap-2 pr-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold mb-0.5 text-gray-600">Nama</label>
                        <input
                          type="text"
                          placeholder="Budi Santoso"
                          className="form-control text-sm"
                          value={person.name}
                          onChange={(e) => changePerson(idx, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-0.5 text-gray-600">Jabatan</label>
                        <input
                          type="text"
                          placeholder="Sales Manager"
                          className="form-control text-sm"
                          value={person.role}
                          onChange={(e) => changePerson(idx, 'role', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-0.5 text-gray-600">
                        <Phone size={11} className="inline mr-1" />Nomor WhatsApp (628xxx)
                      </label>
                      <input
                        type="text"
                        placeholder="6281234567890"
                        className="form-control text-sm"
                        value={person.wa}
                        onChange={(e) => changePerson(idx, 'wa', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPerson}
                className="btn btn-outline w-full text-sm flex items-center justify-center gap-2 border-dashed border-2"
              >
                <Plus size={14} /> Tambah Kontak Person
              </button>
            </div>
          </div>
          {/* ─────────────────────────────── */}

          {/* Sosial Media */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Sosial Media</h2>
            <div className="space-y-4">
              {[
                ['social_instagram', 'Instagram', <Instagram size={16} />],
                ['social_linkedin',  'LinkedIn',  <Linkedin  size={16} />],
                ['social_facebook',  'Facebook',  <Facebook  size={16} />],
              ].map(([key, label, icon]) => (
                <div key={key}>
                  <label className="flex items-center gap-2 text-sm font-medium mb-1">{icon} URL {label}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gambar About */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Gambar Tentang Kami</h2>
            <div className="flex flex-col items-center gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded border border-gray-200 shadow-inner" />
              )}
              <label className="btn btn-outline w-full flex items-center justify-center gap-2 cursor-pointer">
                <Upload size={16} /> Pilih Gambar Baru
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              <p className="text-[10px] text-gray-400 italic">*Rasio 4:3 atau 16:9 direkomendasikan</p>
            </div>
          </div>

          {/* Company Profile */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Company Profile (Google Drive)</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Link URL Google Drive</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={16} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  className="form-control pl-10"
                  value={formData.compro_file}
                  onChange={(e) => setFormData({ ...formData, compro_file: e.target.value })}
                />
              </div>
              <p className="text-[10px] text-gray-500 italic">*Atur akses ke <strong>"Anyone with the link"</strong>.</p>
            </div>
          </div>
        </div>

        {/* ══════════ KOLOM KANAN ══════════ */}
        <div className="space-y-8">

          {/* Statistik */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Statistik Perusahaan</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['stats_projects', 'Total Proyek'],
                ['stats_clients',  'Total Klien'],
                ['stats_years',    'Tahun Pengalaman'],
                ['stats_support',  'Support Layanan'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Nilai Perusahaan */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Prinsip &amp; Nilai Kami</h2>
            <div className="space-y-4">
              {formData.company_values.map((val, idx) => (
                <div key={idx} className="p-3 border border-gray-200 rounded-md relative bg-gray-50/50">
                  <button type="button" onClick={() => removeValue(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-2">
                    <input
                      placeholder="Judul Nilai"
                      className="form-control text-sm font-bold bg-white"
                      value={val.title}
                      onChange={(e) => changeValue(idx, 'title', e.target.value)}
                    />
                    <textarea
                      placeholder="Deskripsi singkat"
                      className="form-control text-sm bg-white"
                      rows="2"
                      value={val.desc}
                      onChange={(e) => changeValue(idx, 'desc', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addValue}
                className="btn btn-outline w-full text-sm flex items-center justify-center gap-2 border-dashed border-2"
              >
                <Plus size={14} /> Tambah Nilai Baru
              </button>
            </div>
          </div>
        </div>

        {/* ══════════ FULL WIDTH ══════════ */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-navy-800">Konten Profil &amp; Alamat</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul Utama Profil</label>
                <input type="text" className="form-control" value={formData.about_title}
                  onChange={(e) => setFormData({ ...formData, about_title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi (|| = paragraf baru)</label>
                <textarea className="form-control" rows="5" value={formData.about_description}
                  onChange={(e) => setFormData({ ...formData, about_description: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Visi</label>
                  <textarea className="form-control" rows="3" value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Misi (|| = poin baru)</label>
                  <textarea className="form-control" rows="3" value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat Kantor Lengkap</label>
                <textarea className="form-control" rows="2" value={formData.contact_address}
                  onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}