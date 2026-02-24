const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { query } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/helpers');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return sendError(res, 'Email dan password wajib diisi.', 422);

    const result = await query(
      'SELECT * FROM admin_users WHERE email = $1 AND is_active = true LIMIT 1',
      [email.toLowerCase()]
    );

    if (!result.rows.length)
      return sendError(res, 'Email atau password salah.', 401);

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return sendError(res, 'Email atau password salah.', 401);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

    sendSuccess(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    }, 'Login berhasil.');
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  sendSuccess(res, req.user);
};

module.exports = { login, me };
