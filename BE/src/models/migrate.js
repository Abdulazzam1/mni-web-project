require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { query, testConnection } = require('../config/db');

const migrate = async () => {
  await testConnection();
  console.log('🔄 Menjalankan migrasi database...');

  const sql = `
    -- Enum types
    DO $$ BEGIN
      CREATE TYPE product_category AS ENUM ('ac', 'genset', 'lampu_led', 'elektrikal', 'lainnya');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE news_category AS ENUM ('berita', 'aktivitas', 'csr');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    -- Products
    CREATE TABLE IF NOT EXISTS products (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      slug        VARCHAR(255) NOT NULL UNIQUE,
      category    product_category NOT NULL DEFAULT 'lainnya',
      brand       VARCHAR(100),
      description TEXT,
      specs       JSONB DEFAULT '{}',
      images      JSONB DEFAULT '[]',
      is_featured BOOLEAN DEFAULT false,
      is_active   BOOLEAN DEFAULT true,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );

    -- Services
    CREATE TABLE IF NOT EXISTS services (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      slug        VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      scope       TEXT,
      icon        VARCHAR(100),
      images      JSONB DEFAULT '[]',
      is_active   BOOLEAN DEFAULT true,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );

    -- Portfolio / Projects
    CREATE TABLE IF NOT EXISTS portfolios (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255) NOT NULL,
      slug        VARCHAR(255) NOT NULL UNIQUE,
      client_name VARCHAR(255),
      client_logo VARCHAR(500),
      location    VARCHAR(255),
      year        SMALLINT,
      scope       TEXT,
      description TEXT,
      images      JSONB DEFAULT '[]',
      is_featured BOOLEAN DEFAULT false,
      is_active   BOOLEAN DEFAULT true,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );

    -- News & Activities
    CREATE TABLE IF NOT EXISTS news (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(500) NOT NULL,
      slug        VARCHAR(500) NOT NULL UNIQUE,
      category    news_category NOT NULL DEFAULT 'berita',
      excerpt     TEXT,
      content     TEXT,
      cover_image VARCHAR(500),
      author      VARCHAR(150) DEFAULT 'Admin MNI',
      is_published BOOLEAN DEFAULT true,
      published_at TIMESTAMPTZ DEFAULT NOW(),
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );

    -- Testimonials
    CREATE TABLE IF NOT EXISTS testimonials (
      id          SERIAL PRIMARY KEY,
      client_name VARCHAR(255) NOT NULL,
      client_title VARCHAR(255),
      client_company VARCHAR(255),
      content     TEXT NOT NULL,
      rating      SMALLINT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
      is_active   BOOLEAN DEFAULT true,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    -- RFQ (Request for Quotation)
    CREATE TABLE IF NOT EXISTS rfq_submissions (
      id            SERIAL PRIMARY KEY,
      company_name  VARCHAR(255) NOT NULL,
      contact_name  VARCHAR(255) NOT NULL,
      email         VARCHAR(255) NOT NULL,
      phone         VARCHAR(50),
      product_interest TEXT,
      message       TEXT,
      is_read       BOOLEAN DEFAULT false,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );

    -- Contact Submissions
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      email       VARCHAR(255) NOT NULL,
      phone       VARCHAR(50),
      subject     VARCHAR(500),
      message     TEXT NOT NULL,
      is_read     BOOLEAN DEFAULT false,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
    CREATE INDEX IF NOT EXISTS idx_portfolios_is_featured ON portfolios(is_featured);
    CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
    CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published, published_at DESC);
  `;

  try {
    await query(sql);
    console.log('✅ Migrasi berhasil.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migrasi gagal:', err.message);
    process.exit(1);
  }
};

migrate();