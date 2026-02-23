const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const sendContactEmail = async ({ name, email, phone, subject, message }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"MNI Website" <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_TO,
    replyTo: email,
    subject: `[Kontak Website] ${subject}`,
    html: `
      <h2>Pesan Baru dari Website MNI</h2>
      <table border="1" cellpadding="8" style="border-collapse:collapse;">
        <tr><td><b>Nama</b></td><td>${name}</td></tr>
        <tr><td><b>Email</b></td><td>${email}</td></tr>
        <tr><td><b>Telepon</b></td><td>${phone || '-'}</td></tr>
        <tr><td><b>Subjek</b></td><td>${subject}</td></tr>
        <tr><td><b>Pesan</b></td><td>${message}</td></tr>
      </table>
    `,
  });
};

const sendRFQEmail = async ({ company_name, contact_name, email, phone, product_interest, message }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"MNI Website" <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_TO,
    replyTo: email,
    subject: `[RFQ] Permintaan Penawaran dari ${company_name}`,
    html: `
      <h2>Request for Quotation (RFQ)</h2>
      <table border="1" cellpadding="8" style="border-collapse:collapse;">
        <tr><td><b>Nama Perusahaan</b></td><td>${company_name}</td></tr>
        <tr><td><b>Nama Kontak</b></td><td>${contact_name}</td></tr>
        <tr><td><b>Email</b></td><td>${email}</td></tr>
        <tr><td><b>Telepon</b></td><td>${phone || '-'}</td></tr>
        <tr><td><b>Produk/Layanan</b></td><td>${product_interest}</td></tr>
        <tr><td><b>Pesan</b></td><td>${message || '-'}</td></tr>
      </table>
    `,
  });
};

module.exports = { sendContactEmail, sendRFQEmail };