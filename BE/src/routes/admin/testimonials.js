const router = require('express').Router();
const { query } = require('../../config/db');
const { paginate, sendSuccess, sendError } = require('../../utils/helpers');

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const [d,c] = await Promise.all([
      query(`SELECT * FROM testimonials ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit,offset]),
      query(`SELECT COUNT(*) FROM testimonials`),
    ]);
    sendSuccess(res, { items: d.rows, total: parseInt(c.rows[0].count), page, limit });
  } catch(err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { client_name, client_title, client_company, content, rating } = req.body;
    const r = await query(`INSERT INTO testimonials (client_name,client_title,client_company,content,rating) VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [client_name,client_title,client_company,content,rating||5]);
    sendSuccess(res, r.rows[0], 'Testimoni ditambahkan.', 201);
  } catch(err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { client_name, client_title, client_company, content, rating } = req.body;
    const r = await query(`UPDATE testimonials SET client_name=$1,client_title=$2,client_company=$3,content=$4,rating=$5 WHERE id=$6 RETURNING *`,
      [client_name,client_title,client_company,content,rating,req.params.id]);
    if (!r.rows.length) return sendError(res,'Tidak ditemukan.',404);
    sendSuccess(res, r.rows[0], 'Testimoni diperbarui.');
  } catch(err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM testimonials WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'Testimoni dihapus.');
  } catch(err) { next(err); }
});

module.exports = router;
