require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { query, testConnection } = require('../config/db');

const seed = async () => {
  await testConnection();
  console.log('🌱 Menjalankan seed data...');

  try {
    // Products
    await query(`
      INSERT INTO products (name, slug, category, brand, description, specs, is_featured)
      VALUES
        ('AC Split 1 PK Masagi', 'ac-split-1pk-masagi', 'ac', 'Masagi',
         'AC Split hemat energi untuk ruangan kecil hingga menengah.',
         '{"kapasitas": "1 PK", "daya": "780 Watt", "freon": "R32", "garansi": "2 tahun"}',
         true),
        ('AC Cassette 2 PK Masagi', 'ac-cassette-2pk-masagi', 'ac', 'Masagi',
         'AC Cassette 4 arah cocok untuk ruang komersial.',
         '{"kapasitas": "2 PK", "daya": "1600 Watt", "freon": "R410A", "garansi": "2 tahun"}',
         true),
        ('Genset Silent 10 KVA', 'genset-silent-10kva', 'genset', 'Masagi',
         'Genset silent dengan kebisingan rendah untuk kebutuhan backup daya.',
         '{"daya": "10 KVA", "bahan_bakar": "Solar", "noise": "< 65 dB", "garansi": "1 tahun"}',
         true),
        ('Lampu LED Panel 24W', 'lampu-led-panel-24w', 'lampu_led', 'Masagi',
         'Lampu LED Panel ultra-tipis untuk pencahayaan kantor dan komersial.',
         '{"daya": "24 Watt", "luminous": "2400 lm", "cri": "> 80", "umur": "50.000 jam"}',
         false),
        ('Kabel NYM 3x2.5mm', 'kabel-nym-3x2-5mm', 'elektrikal', 'Eterna',
         'Kabel instalasi listrik standar SNI untuk bangunan.',
         '{"jenis": "NYM", "ukuran": "3x2.5mm", "tegangan": "500V", "standar": "SNI"}',
         false)
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Services
    await query(`
      INSERT INTO services (name, slug, description, scope, icon)
      VALUES
        ('Preventive Maintenance AC', 'preventive-maintenance-ac',
         'Layanan perawatan berkala AC untuk menjaga performa optimal dan memperpanjang umur unit.',
         'Pembersihan filter, pengecekan freon, kalibrasi thermostat, pemeriksaan komponen elektrikal.',
         'wrench'),
        ('Perbaikan & Servis AC', 'perbaikan-servis-ac',
         'Layanan perbaikan cepat untuk semua merk dan tipe AC, ditangani teknisi berpengalaman.',
         'Diagnosa kerusakan, penggantian komponen, pengisian freon, uji fungsi.',
         'tool'),
        ('Instalasi AC Baru', 'instalasi-ac-baru',
         'Jasa pemasangan AC baru untuk gedung komersial, perkantoran, dan industri.',
         'Survey lokasi, perencanaan instalasi, pemasangan unit indoor/outdoor, commissioning.',
         'settings'),
        ('Maintenance Genset', 'maintenance-genset',
         'Perawatan berkala genset untuk memastikan backup daya selalu siap.',
         'Pengecekan oli, filter, aki, fuel system, load testing, kalibrasi panel.',
         'zap')
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Portfolio
    await query(`
      INSERT INTO portfolios (title, slug, client_name, location, year, scope, description, is_featured)
      VALUES
        ('Instalasi VAC Gedung Perkantoran', 'vac-gedung-perkantoran-jakarta',
         'PT. ABC Indonesia', 'Jakarta Selatan', 2023,
         'Supply & instalasi 50 unit AC Cassette 2 PK, maintenance kontrak 1 tahun.',
         'Proyek supply dan instalasi sistem VAC lengkap untuk gedung perkantoran 10 lantai.',
         true),
        ('Supply Genset Data Center', 'genset-data-center-tangerang',
         'PT. XYZ Technology', 'Tangerang', 2024,
         'Supply 2 unit Genset Silent 200 KVA, instalasi dan commissioning.',
         'Penyediaan backup power untuk data center berkapasitas 200 KVA.',
         true),
        ('Maintenance AC Hotel Bintang 4', 'maintenance-ac-hotel-bandung',
         'Grand Hotel Bandung', 'Bandung', 2023,
         'Kontrak maintenance preventive 150 unit AC, respon 24 jam.',
         'Pengelolaan maintenance sistem AC menyeluruh untuk hotel bintang 4.',
         true)
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Testimonials
    await query(`
      INSERT INTO testimonials (client_name, client_title, client_company, content, rating)
      VALUES
        ('Budi Santoso', 'Building Manager', 'Gedung Graha Utama',
         'MNI sangat responsif dan profesional. Tim teknisi mereka sigap dan berpengalaman. Sangat direkomendasikan untuk kebutuhan maintenance AC gedung.',
         5),
        ('Sari Dewi', 'Facility Manager', 'PT. Maju Bersama',
         'Sudah 3 tahun bekerja sama dengan MNI untuk maintenance AC kantor kami. Pelayanan konsisten dan harga kompetitif.',
         5),
        ('Ahmad Fauzi', 'Direktur Operasional', 'CV. Karya Gemilang',
         'Genset yang disupply MNI berkualitas baik. Proses pengadaan mudah dan tim sales sangat membantu.',
         4)
      ON CONFLICT DO NOTHING;
    `);

    // News
    await query(`
      INSERT INTO news (title, slug, category, excerpt, content, author)
      VALUES
        ('MNI Resmi Menjadi Principal Distributor Masagi di Indonesia',
         'mni-distributor-resmi-masagi',
         'berita',
         'PT. Mitra Niaga Indonesia mendapatkan kepercayaan sebagai Principal Distributor resmi produk Masagi untuk wilayah Indonesia.',
         'PT. Mitra Niaga Indonesia dengan bangga mengumumkan telah resmi ditunjuk sebagai Principal Distributor produk Masagi...',
         'Admin MNI'),
        ('Program CSR MNI: Donasi AC untuk Sekolah Dasar',
         'csr-donasi-ac-sekolah-dasar',
         'csr',
         'Sebagai bentuk tanggung jawab sosial, MNI mendonasikan 10 unit AC untuk sekolah dasar di wilayah Jakarta.',
         'PT. Mitra Niaga Indonesia menjalankan program CSR berupa donasi 10 unit AC untuk SD Negeri...',
         'Admin MNI')
      ON CONFLICT (slug) DO NOTHING;
    `);

    console.log('✅ Seed data berhasil dimasukkan.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed gagal:', err.message);
    process.exit(1);
  }
};

seed();