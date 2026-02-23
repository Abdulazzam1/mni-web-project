const { query } = require('../config/db');
const { paginate, sendSuccess, sendError, toSlug } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { category, featured } = req.query;

    let conditions = ['is_active = true'];
    let params = [];
    let idx = 1;

    if (category) {
      conditions.push(`category = $${idx++}`);
      params.push(category);
    }
    if (featured === 'true') {
      conditions.push(`is_featured = true`);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const [dataRes, countRes] = await Promise.all([
      query(
        `SELECT id, name, slug, category, brand, description, images, is_featured
         FROM products ${where}
         ORDER BY is_featured DESC, created_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, limit, offset]
      ),
      query(`SELECT COUNT(*) FROM products ${where}`, params),
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
      'SELECT * FROM products WHERE slug = $1 AND is_active = true',
      [req.params.slug]
    );
    if (!result.rows.length) return sendError(res, 'Produk tidak ditemukan.', 404);
    sendSuccess(res, result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, category, brand, description, specs, is_featured } = req.body;
    const slug = toSlug(name);
    const result = await query(
      `INSERT INTO products (name, slug, category, brand, description, specs, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, slug, category, brand, description, specs || {}, is_featured || false]
    );
    sendSuccess(res, result.rows[0], 'Produk berhasil ditambahkan.', 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { name, category, brand, description, specs, is_featured, is_active } = req.body;
    const result = await query(
      `UPDATE products SET
        name=$1, category=$2, brand=$3, description=$4, specs=$5,
        is_featured=$6, is_active=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name, category, brand, description, specs, is_featured, is_active, req.params.id]
    );
    if (!result.rows.length) return sendError(res, 'Produk tidak ditemukan.', 404);
    sendSuccess(res, result.rows[0], 'Produk berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await query('UPDATE products SET is_active=false WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'Produk berhasil dihapus.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getBySlug, create, update, remove };