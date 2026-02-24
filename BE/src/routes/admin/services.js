const router = require('express').Router();
const { query } = require('../../config/db');
const { paginate, sendSuccess, sendError, toSlug } = require('../../utils/helpers');

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const [d,c] = await Promise.all([
      query(`SELECT * FROM services ORDER BY id ASC LIMIT $1 OFFSET $2`, [limit,offset]),
      query(`SELECT COUNT(*) FROM services`),
    ]);
    sendSuccess(res, { items: d.rows, total: parseInt(c.rows[0].count), page, limit });
  } catch(err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const r = await query('SELECT * FROM services WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return sendError(res,'Tidak ditemukan.',404);
    sendSuccess(res, r.rows[0]);
  } catch(err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, scope, icon, images } = req.body;
    const r = await query(`INSERT INTO services (name,slug,description,scope,icon,images) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name,toSlug(name),description,scope,icon,JSON.stringify(images||[])]);
    sendSuccess(res, r.rows[0], 'Layanan ditambahkan.', 201);
  } catch(err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, scope, icon, images } = req.body;
    const r = await query(`UPDATE services SET name=$1,slug=$2,description=$3,scope=$4,icon=$5,images=$6,updated_at=NOW() WHERE id=$7 RETURNING *`,
      [name,toSlug(name),description,scope,icon,JSON.stringify(images||[]),req.params.id]);
    if (!r.rows.length) return sendError(res,'Tidak ditemukan.',404);
    sendSuccess(res, r.rows[0], 'Layanan diperbarui.');
  } catch(err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM services WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'Layanan dihapus.');
  } catch(err) { next(err); }
});

module.exports = router;
