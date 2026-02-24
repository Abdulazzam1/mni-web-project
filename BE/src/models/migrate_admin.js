require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { query, testConnection } = require('../config/db');
const bcrypt = require('bcryptjs');

const migrateAdmin = async () => {
  await testConnection();
  console.log('🔄 Migrasi tabel admin...');

  const sql = `
    -- Tabel admin users
    CREATE TABLE IF NOT EXISTS admin_users (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(200) NOT NULL,
      email         VARCHAR(200) NOT NULL UNIQUE,
      password_hash VARCHAR(500) NOT NULL,
      is_active     BOOLEAN DEFAULT true,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );

    -- Tambah kolom is_processed ke rfq_submissions jika belum ada
    ALTER TABLE rfq_submissions ADD COLUMN IF NOT EXISTS is_processed BOOLEAN DEFAULT false;

    -- Index
    CREATE INDEX IF NOT EXISTS idx_rfq_is_read ON rfq_submissions(is_read);
    CREATE INDEX IF NOT EXISTS idx_rfq_is_processed ON rfq_submissions(is_processed);
    CREATE INDEX IF NOT EXISTS idx_contact_is_read ON contact_submissions(is_read);
  `;

  try {
    await query(sql);

    // Buat default super admin jika belum ada
    const existing = await query("SELECT id FROM admin_users WHERE email='admin@mitraniagaindonesia.co.id'");
    if (!existing.rows.length) {
      const hash = await bcrypt.hash('Admin@MNI2024', 12);
      await query(
        "INSERT INTO admin_users (name, email, password_hash) VALUES ($1,$2,$3)",
        ['Super Admin', 'admin@mitraniagaindonesia.co.id', hash]
      );
      console.log('✅ Default admin dibuat: admin@mitraniagaindonesia.co.id / Admin@MNI2024');
    }

    console.log('✅ Migrasi admin selesai.');
    process.exit(0);
  } catch (err) {
    console.error('❌', err.message);
    process.exit(1);
  }
};

migrateAdmin();
