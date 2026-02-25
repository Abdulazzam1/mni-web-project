const { Pool } = require('pg');

module.exports = async () => {
  console.log('\n======================================================');
  console.log('⏳ TES SELESAI! Menunggu 5 menit (300 detik) sebelum pembersihan data dummy...');
  console.log('Silakan cek Dashboard CMS atau FE Anda sekarang.');
  console.log('======================================================');
  
  // Jeda 5 menit
  await new Promise(resolve => setTimeout(resolve, 300000));

  console.log('\n🧹 Memulai pembersihan data dummy [TEST] di database...');
  
  const pool = new Pool({
    user: 'postgres',
    password: 'Azzamya2199', // Sesuai dengan konfigurasi BE Anda
    host: 'localhost',
    port: 5432,
    database: 'mni_db'
  });

  try {
    await pool.query("DELETE FROM products WHERE name LIKE '[TEST]%'");
    await pool.query("DELETE FROM news WHERE title LIKE '[TEST]%'");
    await pool.query("DELETE FROM rfq_submissions WHERE company_name LIKE '[TEST]%'");
    await pool.query("DELETE FROM contact_submissions WHERE name LIKE '[TEST]%'");
    console.log('✅ Pembersihan berhasil! Database kembali bersih.');
  } catch (error) {
    console.error('❌ Gagal membersihkan database:', error.message);
  } finally {
    await pool.end();
  }
};