const { query } = require('../config/db');
const { paginate, sendSuccess, sendError, toSlug } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { category } = req.query;

    let conditions = ['is_published = true'];
    let params = [];

    if (category) {
      conditions.push(`category = $1`);
      params.push(category);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const [dataRes, countRes] = await Promise.all([
      query(
        `SELECT id, title, slug, category, excerpt, cover_image, author, published_at
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
      'SELECT * FROM news WHERE slug = $1 AND is_published = true',
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