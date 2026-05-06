// BE/src/routes/admin/news.js
// TAMBAHAN: PATCH /:id/toggle-home → toggle show_on_home secara langsung
// (pola identik dengan PATCH /:id/toggle untuk is_published)

const router = require('express').Router();
const { query } = require('../../config/db');
const { paginate, sendSuccess, sendError, toSlug } = require('../../utils/helpers');

// GET /api/admin/news
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { search, category } = req.query;
    let conds = [], params = [];
    if (search)   { conds.push(`title ILIKE $${params.length+1}`);  params.push(`%${search}%`); }
    if (category) { conds.push(`category = $${params.length+1}`);   params.push(category); }
    const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
    const [d, c] = await Promise.all([
      query(
        `SELECT id, title, slug, category, excerpt, cover_image, author,
                is_published, show_on_home, published_at, created_at
         FROM news ${where}
         ORDER BY created_at DESC
         LIMIT $${params.length+1} OFFSET $${params.length+2}`,
        [...params, limit, offset]
      ),
      query(`SELECT COUNT(*) FROM news ${where}`, params),
    ]);
    sendSuccess(res, { items: d.rows, total: parseInt(c.rows[0].count), page, limit });
  } catch (err) { next(err); }
});

// GET /api/admin/news/:id
router.get('/:id', async (req, res, next) => {
  try {
    const r = await query('SELECT * FROM news WHERE id = $1', [req.params.id]);
    if (!r.rows.length) return sendError(res, 'Tidak ditemukan.', 404);
    sendSuccess(res, r.rows[0]);
  } catch (err) { next(err); }
});

// POST /api/admin/news
router.post('/', async (req, res, next) => {
  try {
    const { title, category, excerpt, content, cover_image, author, is_published, show_on_home } = req.body;
    const r = await query(
      `INSERT INTO news
         (title, slug, category, excerpt, content, cover_image, author, is_published, show_on_home)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, toSlug(title), category, excerpt, content, cover_image,
       author || 'Admin MNI', is_published || false, show_on_home || false]
    );
    sendSuccess(res, r.rows[0], 'Artikel ditambahkan.', 201);
  } catch (err) { next(err); }
});

// PUT /api/admin/news/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { title, category, excerpt, content, cover_image, author, is_published, show_on_home } = req.body;
    const r = await query(
      `UPDATE news SET
         title        = $1,
         slug         = $2,
         category     = $3,
         excerpt      = $4,
         content      = $5,
         cover_image  = $6,
         author       = $7,
         is_published = $8,
         show_on_home = $9,
         updated_at   = NOW()
       WHERE id = $10 RETURNING *`,
      [title, toSlug(title), category, excerpt, content, cover_image,
       author, is_published, show_on_home || false, req.params.id]
    );
    if (!r.rows.length) return sendError(res, 'Tidak ditemukan.', 404);
    sendSuccess(res, r.rows[0], 'Artikel diperbarui.');
  } catch (err) { next(err); }
});

// PATCH /api/admin/news/:id/toggle  → toggle is_published
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    await query(
      'UPDATE news SET is_published = NOT is_published, updated_at = NOW() WHERE id = $1',
      [req.params.id]
    );
    sendSuccess(res, null, 'Status tayang diperbarui.');
  } catch (err) { next(err); }
});

// PATCH /api/admin/news/:id/toggle-home  → toggle show_on_home ← BARU
router.patch('/:id/toggle-home', async (req, res, next) => {
  try {
    await query(
      'UPDATE news SET show_on_home = NOT show_on_home, updated_at = NOW() WHERE id = $1',
      [req.params.id]
    );
    sendSuccess(res, null, 'Status beranda diperbarui.');
  } catch (err) { next(err); }
});

// DELETE /api/admin/news/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM news WHERE id = $1', [req.params.id]);
    sendSuccess(res, null, 'Artikel dihapus.');
  } catch (err) { next(err); }
});

module.exports = router;