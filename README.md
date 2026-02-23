# PT. Mitra Niaga Indonesia — Website Project

Fullstack web application untuk PT. Mitra Niaga Indonesia.

```
mni-project/
├── BE/        # Backend — Node.js + Express + PostgreSQL
└── FE/        # Frontend — React (Vite) + CSS Modules
```

## Tech Stack

| Layer     | Teknologi                                     |
|-----------|-----------------------------------------------|
| Frontend  | React 18, Vite, React Router v6, CSS Modules  |
| Backend   | Node.js, Express 4, Helmet, Morgan            |
| Database  | PostgreSQL 15                                 |
| Email     | Nodemailer (SMTP)                             |
| Upload    | Multer (local storage / cloud-ready)          |

---

## Quick Start (Development)

### 1. Persiapan Database

```sql
CREATE DATABASE mni_db;
```

### 2. Backend

```bash
cd BE
cp .env.example .env        # Edit sesuai konfigurasi
npm install
npm run migrate             # Buat semua tabel
npm run seed                # Isi data contoh
npm run dev                 # Jalankan BE di port 5000
```

### 3. Frontend

```bash
cd FE
cp .env.example .env        # Edit VITE_API_URL dst.
npm install
npm run dev                 # Jalankan FE di port 5173
```

FE akan tersedia di: `http://localhost:5173`  
API akan tersedia di: `http://localhost:5000/api`

---

## API Endpoints

| Method | Endpoint                   | Deskripsi                    |
|--------|----------------------------|------------------------------|
| GET    | /api/products              | Daftar produk (filter, page) |
| GET    | /api/products/:slug        | Detail produk                |
| GET    | /api/services              | Daftar layanan               |
| GET    | /api/portfolio             | Daftar portfolio             |
| GET    | /api/news                  | Daftar berita/aktivitas      |
| GET    | /api/testimonials          | Daftar testimoni             |
| POST   | /api/contact               | Submit form kontak           |
| POST   | /api/rfq                   | Submit Request for Quotation |
| GET    | /api/health                | Health check                 |

### Query Parameters (GET collections)
- `page` — nomor halaman (default: 1)
- `limit` — jumlah per halaman (default: 12, max: 50)
- `category` — filter kategori produk
- `featured` — filter produk/portfolio unggulan (`true`)

---

## Deployment

### Backend (VPS / Cloud)

1. Copy `.env.example` → `.env`, isi semua variabel
2. Set `NODE_ENV=production`
3. Set `CORS_ORIGIN` ke URL domain FE production
4. `npm install --production`
5. `npm run migrate`
6. Gunakan **PM2** untuk process management:
   ```bash
   pm2 start server.js --name mni-api
   pm2 save
   ```
7. Konfigurasi **Nginx** sebagai reverse proxy ke port 5000

### Frontend (Vercel / Netlify / VPS)

1. Copy `.env.example` → `.env`, set `VITE_API_URL` ke URL BE production
2. `npm run build` → hasil ada di folder `dist/`
3. Untuk VPS: sajikan folder `dist/` via Nginx
4. Untuk Vercel/Netlify: deploy langsung, set environment variables di dashboard

### Nginx Config (contoh)

```nginx
# Backend API
server {
    listen 80;
    server_name api.mitraniagaindonesia.co.id;
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Frontend
server {
    listen 80;
    server_name mitraniagaindonesia.co.id;
    root /var/www/mni-fe/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;  # Penting untuk SPA!
    }
}
```

---

## Struktur Kode FE

```
FE/src/
├── assets/styles/     # Global CSS & design tokens
├── components/
│   ├── common/        # Header, Footer, Layout, WhatsApp, SEOMeta
│   ├── home/          # Hero, ServicesSummary, FeaturedProducts, Testimonials, CTA
│   ├── products/      # ProductCard, ProductFilter
│   ├── portfolio/     # PortfolioCard
│   └── contact/       # RFQForm
├── hooks/             # useFetch
├── pages/             # Satu file per halaman
├── services/          # API calls (axios)
└── utils/             # constants, formatters
```

## Struktur Kode BE

```
BE/src/
├── config/            # db.js (PostgreSQL pool)
├── controllers/       # Business logic per resource
├── middleware/        # errorHandler, upload (multer)
├── models/            # migrate.js, seed.js
├── routes/            # Express routers
└── utils/             # helpers.js, mailer.js
```

---

## Konten yang Perlu Diisi Client

- [ ] Logo perusahaan → simpan di `FE/public/`
- [ ] Foto produk → upload via API `/uploads`  
- [ ] Foto portfolio → upload via API `/uploads`
- [ ] Alamat & kontak → isi di `FE/.env`
- [ ] Google Maps Embed URL → isi `VITE_GOOGLE_MAPS_EMBED`
- [ ] SMTP email → isi di `BE/.env`
- [ ] Data produk, layanan, portfolio → via seed atau API