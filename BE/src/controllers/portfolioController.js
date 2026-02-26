const { query } = require('../config/db');
const { paginate, sendSuccess, sendError, toSlug } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { featured } = req.query;

    let conditions = ['is_active = true'];
    if (featured === 'true') conditions.push('is_featured = true');
    const where = `WHERE ${conditions.join(' AND ')}`;

    const [dataRes, countRes] = await Promise.all([
      query(
        `SELECT id, title, slug, client_name, client_logo, location, year,
                scope, images, is_featured
         FROM portfolios ${where}
         ORDER BY is_featured DESC, year DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query(`SELECT COUNT(*) FROM portfolios ${where}`),
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
    // FIX: Mencari berdasarkan SLUG ataupun ID secara bersamaan
    const result = await query(
      'SELECT * FROM portfolios WHERE (slug = $1 OR id::text = $1) AND is_active = true',
      [req.params.slug]
    );
    if (!result.rows.length) return sendError(res, 'Portfolio tidak ditemukan.', 404);
    sendSuccess(res, result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, client_name, client_logo, location, year, scope, description, is_featured } = req.body;
    const slug = toSlug(title);
    const result = await query(
      `INSERT INTO portfolios (title, slug, client_name, client_logo, location, year, scope, description, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, slug, client_name, client_logo, location, year, scope, description, is_featured || false]
    );
    sendSuccess(res, result.rows[0], 'Portfolio berhasil ditambahkan.', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getBySlug, create };