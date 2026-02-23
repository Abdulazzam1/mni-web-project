const { query } = require('../config/db');
const { sendSuccess } = require('../utils/helpers');

const getAll = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM testimonials WHERE is_active = true ORDER BY created_at DESC LIMIT 10'
    );
    sendSuccess(res, result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll };