const { query } = require('../config/db');
const { sendSuccess, sendError, toSlug } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM services WHERE is_active = true ORDER BY id ASC'
    );
    sendSuccess(res, result.rows);
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM services WHERE slug = $1 AND is_active = true',
      [req.params.slug]
    );
    if (!result.rows.length) return sendError(res, 'Layanan tidak ditemukan.', 404);
    sendSuccess(res, result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description, scope, icon } = req.body;
    const slug = toSlug(name);
    const result = await query(
      'INSERT INTO services (name, slug, description, scope, icon) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, slug, description, scope, icon]
    );
    sendSuccess(res, result.rows[0], 'Layanan berhasil ditambahkan.', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getBySlug, create };