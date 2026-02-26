const { query } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/helpers');
const { sendRFQEmail } = require('../utils/mailer');

const submit = async (req, res, next) => {
  try {
    const { company_name, contact_name, email, phone, product_interest, message } = req.body;

    if (!company_name || !contact_name || !email || !product_interest) {
      return sendError(res, 'Nama perusahaan, kontak, email, dan produk wajib diisi.', 422);
    }

    // 1. Simpan data RFQ ke database (Fitur Stabil)
    await query(
      `INSERT INTO rfq_submissions (company_name, contact_name, email, phone, product_interest, message)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [company_name, contact_name, email, phone, product_interest, message]
    );

    // 2. FITUR BARU: Ambil Email Tujuan (Admin) dari tabel pengaturan dinamis
    const settingsResult = await query(`SELECT contact_email FROM company_settings WHERE id = 1`);
    const adminEmail = settingsResult.rows[0]?.contact_email;

    // 3. Eksekusi pengiriman email di latar belakang (Background Process / "Siluman")
    if (adminEmail) {
      // Kita kirimkan data beserta "adminEmail" sebagai alamat tujuan
      sendRFQEmail({ 
        adminEmail, // <-- Ini variabel baru untuk mailer
        company_name, 
        contact_name, 
        email, // <-- Ini email dari calon klien (pengisi form)
        phone, 
        product_interest, 
        message 
      }).catch((err) => {
        // Jika email gagal, jangan batalkan proses submit, cukup catat error-nya
        console.error('Gagal kirim email RFQ:', err.message);
      });
    } else {
      console.warn('Admin email belum diatur di CMS. Notifikasi email RFQ dibatalkan.');
    }

    // 4. Kirim respons berhasil ke Frontend tanpa harus membuka tab baru
    sendSuccess(res, null, 'Permintaan penawaran berhasil dikirim. Tim kami akan segera menghubungi Anda.', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { submit };