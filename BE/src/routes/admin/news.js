const router = require('express').Router();
const { query } = require('../../config/db');
const { paginate, sendSuccess, sendError, toSlug } = require('../../utils/helpers');

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { search, category } = req.query;
    let conds = [], params = [];
    if (search) { conds.push(`title ILIKE $${params.length+1}`); params.push(`%${search}%`); }
    if (category) { conds.push(`category = $${params.length+1}`); params.push(category); }
    const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
    const [d, c] = await Promise.all([
      query(`SELECT id,title,slug,category,excerpt,cover_image,author,is_published,published_at,created_at FROM news ${where} ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`, [...params,limit,offset]),
      query(`SELECT COUNT(*) FROM news ${where}`, params),
    ]);
    sendSuccess(res, { items: d.rows, total: parseInt(c.rows[0].count), page, limit });
  } catch(err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const r = await query('SELECT * FROM news WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return sendError(res,'Tidak ditemukan.',404);
    sendSuccess(res, r.rows[0]);
  } catch(err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, category, excerpt, content, cover_image, author, is_published } = req.body;
    const slug = toSlug(title);
    const r = await query(`INSERT INTO news (title,slug,category,excerpt,content,cover_image,author,is_published) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title,slug,category,excerpt,content,cover_image,author||'Admin MNI',is_published||false]);
    sendSuccess(res, r.rows[0], 'Artikel ditambahkan.', 201);
  } catch(err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, category, excerpt, content, cover_image, author, is_published } = req.body;
    const r = await query(`UPDATE news SET title=$1,slug=$2,category=$3,excerpt=$4,content=$5,cover_image=$6,author=$7,is_published=$8,updated_at=NOW() WHERE id=$9 RETURNING *`,
      [title,toSlug(title),category,excerpt,content,cover_image,author,is_published,req.params.id]);
    if (!r.rows.length) return sendError(res,'Tidak ditemukan.',404);
    sendSuccess(res, r.rows[0], 'Artikel diperbarui.');
  } catch(err) { next(err); }
});

router.patch('/:id/toggle', async (req, res, next) => {
  try {
    await query('UPDATE news SET is_published = NOT is_published, updated_at=NOW() WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'Status diperbarui.');
  } catch(err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM news WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'Artikel dihapus.');
  } catch(err) { next(err); }
});

module.exports = router;
