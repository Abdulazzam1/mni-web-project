// Mengambil fungsi query sesuai dengan standar config/db.js Anda
const { query } = require('../config/db');

const bannerController = {
  // GET: Ambil semua banner untuk Admin CMS
  getAllBanners: async (req, res) => {
    try {
      const result = await query('SELECT * FROM banners ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET: Ambil HANYA banner yang aktif untuk Frontend Publik
  getActiveBanners: async (req, res) => {
    try {
      const result = await query('SELECT * FROM banners WHERE is_active = true ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST: Tambah banner baru
  createBanner: async (req, res) => {
    try {
      const { title, is_active } = req.body;
      
      // 1. Validasi File: Multer menaruh data di req.file
      if (!req.file) {
        return res.status(400).json({ error: 'File gambar wajib diunggah' });
      }

      // PERBAIKAN: Memasukkan 'misc' ke dalam URL agar sinkron dengan rute global uploads
      const image_url = `/uploads/misc/${req.file.filename}`;

      // 2. Konversi is_active dari String ke Boolean (karena FormData mengirim string)
      const isActiveBool = is_active === 'true' || is_active === true;

      const result = await query(
        'INSERT INTO banners (title, image_url, is_active) VALUES ($1, $2, $3) RETURNING *',
        [title, image_url, isActiveBool]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error Create Banner:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // PUT: Update banner
  updateBanner: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, is_active, existing_url } = req.body;
      
      // PERBAIKAN: Jika ada file baru, pastikan rutenya menggunakan /uploads/misc/
      const image_url = req.file ? `/uploads/misc/${req.file.filename}` : existing_url;

      // Konversi is_active ke Boolean
      const isActiveBool = is_active === 'true' || is_active === true;

      const result = await query(
        'UPDATE banners SET title = $1, image_url = $2, is_active = $3 WHERE id = $4 RETURNING *',
        [title, image_url, isActiveBool, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Banner tidak ditemukan' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error Update Banner:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE: Hapus banner
  deleteBanner: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await query('DELETE FROM banners WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Banner tidak ditemukan' });
      }

      res.json({ message: 'Banner berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = bannerController;