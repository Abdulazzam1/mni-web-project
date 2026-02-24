const router = require('express').Router();
const { query } = require('../../config/db');
const { paginate, sendSuccess, sendError, toSlug } = require('../../utils/helpers');

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { search, category } = req.query;
    let conds = [], params = [];
    if (search) { conds.push(`(name ILIKE $${params.length+1} OR brand ILIKE $${params.length+1})`); params.push(`%${search}%`); }
    if (category) { conds.push(`category = $${params.length+1}`); params.push(category); }
    const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
    const [d, c] = await Promise.all([
      query(`SELECT id,name,slug,category,brand,description,images,specs,is_active,is_featured,created_at FROM products ${where} ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`, [...params,limit,offset]),
      query(`SELECT COUNT(*) FROM products ${where}`, params),
    ]);
    sendSuccess(res, { items: d.rows, total: parseInt(c.rows[0].count), page, limit });
  } catch(err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const r = await query('SELECT * FROM products WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return sendError(res,'Tidak ditemukan.',404);
    sendSuccess(res, r.rows[0]);
  } catch(err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, brand, category, description, specs, images, is_featured, is_active } = req.body;
    const slug = toSlug(name);
    const r = await query(`INSERT INTO products (name,slug,category,brand,description,specs,images,is_featured,is_active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name,slug,category,brand,description,JSON.stringify(specs||{}),JSON.stringify(images||[]),is_featured||false,is_active!==false]);
    sendSuccess(res, r.rows[0], 'Produk ditambahkan.', 201);
  } catch(err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, brand, category, description, specs, images, is_featured, is_active } = req.body;
    const r = await query(`UPDATE products SET name=$1,slug=$2,category=$3,brand=$4,description=$5,specs=$6,images=$7,is_featured=$8,is_active=$9,updated_at=NOW() WHERE id=$10 RETURNING *`,
      [name,toSlug(name),category,brand,description,JSON.stringify(specs||{}),JSON.stringify(images||[]),is_featured,is_active,req.params.id]);
    if (!r.rows.length) return sendError(res,'Tidak ditemukan.',404);
    sendSuccess(res, r.rows[0], 'Produk diperbarui.');
  } catch(err) { next(err); }
});

router.patch('/:id/toggle', async (req, res, next) => {
  try {
    await query('UPDATE products SET is_active = NOT is_active, updated_at=NOW() WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'Status diperbarui.');
  } catch(err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM products WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'Produk dihapus.');
  } catch(err) { next(err); }
});

module.exports = router;
