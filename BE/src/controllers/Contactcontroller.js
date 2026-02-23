const { query } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/helpers');
const { sendContactEmail } = require('../utils/mailer');

const submit = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return sendError(res, 'Nama, email, dan pesan wajib diisi.', 422);
    }

    await query(
      `INSERT INTO contact_submissions (name, email, phone, subject, message)
       VALUES ($1,$2,$3,$4,$5)`,
      [name, email, phone, subject, message]
    );

    // Kirim notifikasi email (non-blocking jika gagal)
    sendContactEmail({ name, email, phone, subject, message }).catch((err) => {
      console.error('Gagal kirim email kontak:', err.message);
    });

    sendSuccess(res, null, 'Pesan berhasil dikirim. Kami akan segera menghubungi Anda.', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { submit };