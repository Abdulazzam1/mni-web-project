/**
 * Buka WhatsApp Web dengan pesan otomatis
 */
export const replyRFQ = ({ contact_name, company_name, product_interest, phone }) => {
  const msg = [
    `Halo *${contact_name}*,`,
    ``,
    `Terima kasih atas ketertarikan Anda dari *${company_name || 'perusahaan Anda'}* pada produk/layanan *${product_interest || 'kami'}*.`,
    ``,
    `Kami dari tim MNI (Mitra Niaga Indonesia) siap membantu memberikan informasi lebih lanjut dan penawaran terbaik.`,
    ``,
    `Bisa kami minta waktu untuk berdiskusi lebih lanjut? 🙏`,
    ``,
    `Salam,`,
    `Tim Sales MNI`,
  ].join('\n');

  const cleanPhone = (phone || '').replace(/\D/g, '');
  const number = cleanPhone.startsWith('0')
    ? '62' + cleanPhone.slice(1)
    : cleanPhone || '6281234567890';

  window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
};

export const replyContact = ({ name, phone }) => {
  const msg = [
    `Halo *${name}*,`,
    ``,
    `Terima kasih telah menghubungi PT. Mitra Niaga Indonesia.`,
    `Kami telah menerima pesan Anda dan akan segera merespons.`,
    ``,
    `Ada yang bisa kami bantu lebih lanjut?`,
    ``,
    `Salam,`,
    `Tim MNI`,
  ].join('\n');

  const cleanPhone = (phone || '').replace(/\D/g, '');
  const number = cleanPhone.startsWith('0')
    ? '62' + cleanPhone.slice(1)
    : cleanPhone || '6281234567890';

  window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
};
