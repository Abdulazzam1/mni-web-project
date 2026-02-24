const router = require('express').Router();
const { query } = require('../../config/db');
const { paginate, sendSuccess, sendError, toSlug } = require('../../utils/helpers');

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const [d,c] = await Promise.all([
      query(`SELECT id,title,slug,client_name,client_logo,location,year,scope,images,is_featured,is_active,created_at FROM portfolios ORDER BY is_featured DESC,year DESC LIMIT $1 OFFSET $2`, [limit,offset]),
      query(`SELECT COUNT(*) FROM portfolios`),
    ]);
    sendSuccess(res, { items: d.rows, total: parseInt(c.rows[0].count), page, limit });
  } catch(err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const r = await query('SELECT * FROM portfolios WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return sendError(res,'Tidak ditemukan.',404);
    sendSuccess(res, r.rows[0]);
  } catch(err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, client_name, client_logo, location, year, scope, description, images, is_featured } = req.body;
    const r = await query(`INSERT INTO portfolios (title,slug,client_name,client_logo,location,year,scope,description,images,is_featured) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title,toSlug(title),client_name,client_logo,location,year,scope,description,JSON.stringify(images||[]),is_featured||false]);
    sendSuccess(res, r.rows[0], 'Portfolio ditambahkan.', 201);
  } catch(err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, client_name, client_logo, location, year, scope, description, images, is_featured } = req.body;
    const r = await query(`UPDATE portfolios SET title=$1,slug=$2,client_name=$3,client_logo=$4,location=$5,year=$6,scope=$7,description=$8,images=$9,is_featured=$10,updated_at=NOW() WHERE id=$11 RETURNING *`,
      [title,toSlug(title),client_name,client_logo,location,year,scope,description,JSON.stringify(images||[]),is_featured,req.params.id]);
    if (!r.rows.length) return sendError(res,'Tidak ditemukan.',404);
    sendSuccess(res, r.rows[0], 'Portfolio diperbarui.');
  } catch(err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM portfolios WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'Portfolio dihapus.');
  } catch(err) { next(err); }
});

module.exports = router;
