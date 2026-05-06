// BE/src/controllers/Newscontroller.js
// REVISI TAHAP 6: Tambah filter show_on_home=true di getAll (public endpoint)
// Semua fungsi lain (getBySlug, create) tidak berubah.

const { query } = require('../config/db');
const { paginate, sendSuccess, sendError, toSlug } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { category, show_on_home } = req.query;   // ← TAMBAHAN

    let conditions = ['is_published = true'];
    let params = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    // TAHAP 6: filter untuk Beranda
    if (show_on_home === 'true') {
      conditions.push('show_on_home = true');
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const [dataRes, countRes] = await Promise.all([
      query(
        `SELECT id, title, slug, category, excerpt, cover_image, author, published_at, show_on_home
         FROM news ${where}
         ORDER BY published_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      ),
      query(`SELECT COUNT(*) FROM news ${where}`, params),
    ]);

    sendSuccess(res, {
      items: dataRes.rows,
      total: parseInt(countRes.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM news WHERE (slug = $1 OR id::text = $1) AND is_published = true',
      [req.params.slug]
    );
    if (!result.rows.length) return sendError(res, 'Berita tidak ditemukan.', 404);
    sendSuccess(res, result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, category, excerpt, content, cover_image, author } = req.body;
    const slug = toSlug(title);
    const result = await query(
      `INSERT INTO news (title, slug, category, excerpt, content, cover_image, author)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, slug, category, excerpt, content, cover_image, author || 'Admin MNI']
    );
    sendSuccess(res, result.rows[0], 'Berita berhasil ditambahkan.', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getBySlug, create };