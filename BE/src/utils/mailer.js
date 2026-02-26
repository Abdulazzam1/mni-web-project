const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 465,
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

const sendRFQEmail = async ({ adminEmail, company_name, contact_name, email, phone, product_interest, message }) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1a365d; border-bottom: 2px solid #f6ad55; padding-bottom: 10px;">New RFQ Submission</h2>
      <p>Halo Admin MNI, ada permintaan penawaran baru dari website:</p>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Perusahaan</td><td>: ${company_name}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Nama Kontak</td><td>: ${contact_name}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Email Klien</td><td>: ${email}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Telepon</td><td>: ${phone || '-'}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Produk Minat</td><td>: <span style="background: #fffaf0; padding: 2px 6px; border-radius: 4px; border: 1px solid #fbd38d;">${product_interest}</span></td></tr>
      </table>
      
      <div style="margin-top: 20px; padding: 15px; background: #f7fafc; border-radius: 5px;">
        <strong style="display: block; margin-bottom: 5px;">Pesan/Keterangan:</strong>
        <p style="margin: 0; font-style: italic;">"${message || 'Tidak ada pesan tambahan.'}"</p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #718096;">Sistem Otomatis PT Mitra Niaga Indonesia</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"MNI System Bot" <${process.env.MAIL_FROM}>`,
    to: adminEmail || process.env.MAIL_TO,
    replyTo: email,
    // PERUBAHAN DI SINI: Subjek diganti menjadi PERMINTAAN RFQ
    subject: `PERMINTAAN RFQ: ${company_name} - ${product_interest}`,
    html: htmlContent,
  });
};

module.exports = { sendContactEmail, sendRFQEmail };