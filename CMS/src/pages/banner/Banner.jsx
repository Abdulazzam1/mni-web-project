import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk form tambah banner
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);

  // Fungsi untuk mengambil data banner dari Backend
  const fetchBanners = async () => {
    try {
      const response = await api.get('/banner'); 
      setBanners(response.data);
    } catch (error) {
      console.error('Gagal mengambil data banner:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Fungsi untuk mengunggah banner baru
  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Pilih gambar banner terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('is_active', true); // Default: langsung tayang

    try {
      const response = await api.post('/banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // ─── PERBAIKAN SINKRONISASI TEST ───────────────────────────
      // Menggunakan pengecekan status sukses yang eksplisit
      if (response.status === 201 || response.status === 200) {
        // 1. Reset Form state
        setTitle('');
        setImage(null);
        if (document.getElementById('banner-image')) {
          document.getElementById('banner-image').value = ''; 
        }
        
        // 2. Jalankan Fetch data terbaru dan TUNGGU (await) sampai selesai.
        // Ini memastikan state 'banners' terupdate dan baris <tr> baru 
        // sudah ter-render di DOM sebelum eksekusi berlanjut ke alert.
        await fetchBanners(); 
        
        // 3. Tampilkan Alert terakhir. 
        // Alert bersifat blocking (menghentikan script), jadi kita pastikan 
        // tabel sudah sinkron secara visual untuk kebutuhan Automated Test.
        alert('Banner berhasil ditambahkan!');
      }
      // ───────────────────────────────────────────────────────────
    } catch (error) {
      console.error('Gagal menambah banner:', error);
      alert(error.response?.data?.error || 'Gagal mengunggah banner.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menyalakan/mematikan banner
  const handleToggleStatus = async (banner) => {
    try {
      await api.put(`/banner/${banner.id}`, {
        title: banner.title || '',
        is_active: !banner.is_active,
        existing_url: banner.image_url // <--- PERBAIKAN: Mengirim URL gambar lama agar tidak ditolak database
      });
      await fetchBanners(); // Refresh tabel setelah diubah
    } catch (error) {
      console.error('Gagal mengubah status:', error);
      alert('Gagal mengubah status banner. Cek console untuk detailnya.');
    }
  };

  // Fungsi untuk menghapus banner
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus banner ini?')) {
      try {
        await api.delete(`/banner/${id}`);
        await fetchBanners(); // Refresh tabel
      } catch (error) {
        console.error('Gagal menghapus banner:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 font-display">Manajemen Banner & Promo</h1>

      {/* Form Tambah Banner */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tambah Banner Baru</h2>
        <form onSubmit={handleSumbit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Promo (Opsional)</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="Contoh: Promo Masagi Bebas Cemas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Gambar</label>
            <input 
              id="banner-image"
              type="file" 
              accept="image/*"
              className="w-full border border-gray-300 rounded-md p-1.5 bg-white focus:outline-none cursor-pointer" 
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200 disabled:bg-gray-400 h-[42px]"
          >
            {isLoading ? 'Mengunggah...' : '+ Simpan Banner'}
          </button>
        </form>
      </div>

      {/* Tabel Daftar Banner */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Preview Gambar</th>
              <th className="p-4 font-semibold text-gray-600">Judul</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Tayang di Publik?</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">Belum ada banner yang ditambahkan.</td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <img 
                      src={banner.image_url} 
                      alt={banner.title} 
                      className="h-20 w-40 object-cover rounded shadow-sm border"
                      onError={(e) => { e.target.src = '/placeholder.jpg' }} 
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{banner.title || 'Tanpa Judul'}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleToggleStatus(banner)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${banner.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                      title={banner.is_active ? 'Matikan Banner' : 'Nyalakan Banner'}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${banner.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banner;