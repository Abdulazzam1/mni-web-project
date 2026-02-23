const { query } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/helpers');
const { sendRFQEmail } = require('../utils/mailer');

const submit = async (req, res, next) => {
  try {
    const { company_name, contact_name, email, phone, product_interest, message } = req.body;

    if (!company_name || !contact_name || !email || !product_interest) {
      return sendError(res, 'Nama perusahaan, kontak, email, dan produk wajib diisi.', 422);
    }

    await query(
      `INSERT INTO rfq_submissions (company_name, contact_name, email, phone, product_interest, message)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [company_name, contact_name, email, phone, product_interest, message]
    );

    sendRFQEmail({ company_name, contact_name, email, phone, product_interest, message }).catch((err) => {
      console.error('Gagal kirim email RFQ:', err.message);
    });

    sendSuccess(res, null, 'Permintaan penawaran berhasil dikirim. Tim kami akan segera menghubungi Anda.', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { submit };