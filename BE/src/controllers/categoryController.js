const { query } = require('../config/db');
const { toSlug } = require('../utils/helpers');

const categoryController = {
  // GET: Ambil semua kategori (Untuk dropdown CMS & filter Frontend)
  getAllCategories: async (req, res) => {
    try {
      const result = await query('SELECT * FROM product_categories ORDER BY name ASC');
      res.json({ success: true, data: result.rows });
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST: Tambah kategori baru (Dari CMS)
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });

      const slug = toSlug(name);
      
      // Cek apakah kategori sudah ada
      const check = await query('SELECT * FROM product_categories WHERE slug = $1', [slug]);
      if (check.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Kategori ini sudah ada.' });
      }

      const result = await query(
        'INSERT INTO product_categories (name, slug) VALUES ($1, $2) RETURNING *',
        [name, slug]
      );
      
      res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan.', data: result.rows[0] });
    } catch (err) {
      console.error('Error creating category:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT: Update kategori (Dari CMS)
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
      const slug = toSlug(name);

      const result = await query(
        'UPDATE product_categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *',
        [name, slug, id]
      );

      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      
      res.json({ success: true, message: 'Kategori berhasil diperbarui.', data: result.rows[0] });
    } catch (err) {
      console.error('Error updating category:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE: Hapus kategori (Dari CMS)
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Opsional: Anda bisa menambahkan logika pengecekan apakah kategori ini 
      // masih dipakai oleh produk sebelum menghapusnya.
      
      const result = await query('DELETE FROM product_categories WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
      
      res.json({ success: true, message: 'Kategori berhasil dihapus.' });
    } catch (err) {
      console.error('Error deleting category:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = categoryController;