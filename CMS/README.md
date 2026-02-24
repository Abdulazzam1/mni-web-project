# MNI CMS — Panel Admin

Panel administrasi internal PT. Mitra Niaga Indonesia.
Dibangun dengan React + Vite + Tailwind CSS + TanStack Query.

```
CMS/src/
├── components/
│   ├── ui/           # Toast, Confirm, DataTable, ImageUpload, Toggle, Badge, dll.
│   ├── layout/       # AdminLayout, Sidebar, Topbar, AuthLayout
│   └── dashboard/    # MetricCard, TrendChart, RecentRFQ
├── contexts/         # AuthContext (login/logout state)
├── hooks/            # useToast, useConfirm, useDebounce, useTable
├── pages/
│   ├── auth/         # LoginPage
│   ├── dashboard/    # DashboardPage
│   ├── products/     # ProductsPage + ProductFormPage
│   ├── services/     # ServicesPage + ServiceFormPage
│   ├── portfolio/    # PortfolioPage + PortfolioFormPage
│   ├── news/         # NewsPage + NewsFormPage
│   ├── testimonials/ # TestimonialsPage (modal inline)
│   ├── rfq/          # RFQPage (WA reply + mark processed)
│   └── contact/      # ContactPage (WA reply)
├── services/         # API calls per resource (axios)
└── utils/            # formatters, whatsapp, helpers
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup env
cp .env.example .env
# Edit VITE_API_URL jika BE tidak di localhost:5000

# 3. Jalankan dev server (port 5174)
npm run dev
```

## Setup Backend untuk CMS

```bash
cd ../BE

# 1. Tambah deps baru
npm install bcryptjs jsonwebtoken

# 2. Tambah di .env:
# JWT_SECRET=your_super_secret_key_min_32_chars
# JWT_EXPIRES=7d

# 3. Jalankan migrasi tabel admin
npm run migrate:admin
# → Ini otomatis buat default admin:
#   Email: admin@mitraniagaindonesia.co.id
#   Password: Admin@MNI2024
```

## Fitur yang Tersedia

| Halaman       | Fitur                                             |
|---------------|--------------------------------------------------|
| Dashboard     | 4 metric cards, bar chart tren 30 hari, 5 RFQ terbaru |
| Produk        | CRUD + toggle aktif/unggulan + multi-gambar upload |
| Layanan       | CRUD + gambar inline                             |
| Portfolio     | CRUD + multi-foto + toggle unggulan              |
| Berita        | CRUD + toggle Draft/Published + cover image      |
| Testimoni     | CRUD via modal inline (tanpa halaman baru)       |
| RFQ           | View + WA reply + tandai diproses + tab filter   |
| Pesan         | View + WA reply + tandai dibaca + tab filter     |

## Login Default

```
URL:      http://localhost:5174
Email:    admin@mitraniagaindonesia.co.id
Password: Admin@MNI2024
```
⚠️ **Ganti password setelah login pertama!**

## Deploy CMS

```bash
# Build
npm run build

# Sajikan dist/ via Nginx di subdomain:
# cms.mitraniagaindonesia.co.id
```

> CMS ini berjalan terpisah dari website publik (FE).
> CMS di port 5174 (dev) / subdomain (prod).
> Website publik di port 5173 (dev) / domain utama (prod).
