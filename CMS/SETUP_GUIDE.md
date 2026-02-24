# 🚀 PANDUAN SETUP CMS MNI
# Panel Admin PT. Mitra Niaga Indonesia

---

## 📁 STRUKTUR PROJECT LENGKAP

```
C:\Hefni\MNI\mni-project\
├── BE/                    ← Backend (sudah ada)
├── FE/                    ← Website publik (sudah ada)
└── CMS/                   ← Panel Admin (file ini) ← BARU
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── App.jsx               ← Router utama (semua routes)
        ├── main.jsx              ← Entry point + React Query setup
        ├── index.css             ← Tailwind + design system
        ├── contexts/
        │   └── AuthContext.jsx   ← Login/logout state (JWT)
        ├── hooks/
        │   ├── useToast.js       ← Notifikasi toast
        │   ├── useConfirm.js     ← Dialog konfirmasi hapus
        │   ├── useDebounce.js    ← Debounce pencarian
        │   └── useTable.js       ← Paginasi & state tabel
        ├── services/             ← Semua API calls (axios)
        │   ├── api.js            ← Axios instance + interceptor
        │   ├── authService.js
        │   ├── dashboardService.js
        │   ├── productService.js
        │   ├── serviceService.js
        │   ├── portfolioService.js
        │   ├── newsService.js
        │   ├── testimonialService.js
        │   ├── rfqService.js
        │   ├── contactService.js
        │   └── uploadService.js
        ├── utils/
        │   ├── formatters.js     ← Format tanggal, truncate, imgUrl
        │   ├── whatsapp.js       ← Auto-generate WA pesan
        │   └── helpers.js        ← slugify, getErrorMsg, constants
        ├── components/
        │   ├── layout/
        │   │   ├── AdminLayout.jsx  ← Shell: Sidebar + Topbar
        │   │   ├── AuthLayout.jsx   ← Layout halaman login
        │   │   ├── Sidebar.jsx      ← Navigasi kiri + badge unread
        │   │   └── Topbar.jsx       ← Header + notifikasi + profil
        │   ├── ui/
        │   │   ├── index.jsx        ← Spinner, Badge, Pagination, dll
        │   │   ├── Toast.jsx        ← Notifikasi sukses/error
        │   │   ├── Confirm.jsx      ← Dialog konfirmasi hapus
        │   │   ├── DataTable.jsx    ← Tabel reusable + pagination
        │   │   └── ImageUpload.jsx  ← Upload gambar inline + preview
        │   └── dashboard/
        │       ├── MetricCard.jsx   ← Kartu statistik utama
        │       ├── TrendChart.jsx   ← Bar chart Recharts
        │       └── RecentRFQ.jsx    ← Tabel 5 RFQ terbaru
        └── pages/
            ├── auth/
            │   └── LoginPage.jsx
            ├── dashboard/
            │   └── DashboardPage.jsx
            ├── products/
            │   ├── ProductsPage.jsx     ← List + toggle aktif/unggulan
            │   └── ProductFormPage.jsx  ← Form + multi-gambar + spesifikasi
            ├── services/
            │   ├── ServicesPage.jsx
            │   └── ServiceFormPage.jsx
            ├── portfolio/
            │   ├── PortfolioPage.jsx
            │   └── PortfolioFormPage.jsx
            ├── news/
            │   ├── NewsPage.jsx         ← List + toggle Draft/Published
            │   └── NewsFormPage.jsx     ← Editor + cover image
            ├── testimonials/
            │   └── TestimonialsPage.jsx ← CRUD via modal inline
            ├── rfq/
            │   └── RFQPage.jsx          ← Tabs + WA reply + mark processed
            └── contact/
                └── ContactPage.jsx      ← Tabs + WA reply
```

---

## ⚡ LANGKAH SETUP (URUTAN WAJIB)

### STEP 1 — Setup Backend (tambahan untuk CMS)

```bash
cd C:\Hefni\MNI\mni-project\BE

# Install dependency baru
npm install bcryptjs jsonwebtoken
```

Tambahkan ke `BE/.env`:
```
JWT_SECRET=MNI_SuperSecret_Admin_2024_Ganti_Ini_Sekarang
JWT_EXPIRES=7d
```

Copy file-file dari folder `BE_additions/` ke project BE:

| File dari BE_additions/          | Copy ke                                      |
|----------------------------------|----------------------------------------------|
| `auth_middleware.js`             | `BE/src/middleware/auth.js`                  |
| `authController.js`              | `BE/src/controllers/authController.js`       |
| `auth_routes.js`                 | `BE/src/routes/auth.js`                      |
| `migrate_admin.js`               | `BE/src/models/migrate_admin.js`             |
| `admin_routes/` (folder)         | `BE/src/routes/admin/` (folder baru)         |

Tambahkan ke `BE/src/app.js` (setelah baris testimonialRoutes):
```js
const authRoutes  = require('./routes/auth');
const adminRoutes = require('./routes/admin/index');
// ...
app.use('/api/auth',  authRoutes);
app.use('/api/admin', adminRoutes);
```

Jalankan migrasi:
```bash
node src/models/migrate_admin.js
# Output: ✅ Default admin dibuat: admin@mitraniagaindonesia.co.id / Admin@MNI2024
```

### STEP 2 — Setup CMS

```bash
cd C:\Hefni\MNI\mni-project\CMS

# Install semua dependencies
npm install

# Copy env
copy .env.example .env
# Edit .env jika BE bukan di localhost:5000

# Jalankan dev server (port 5174)
npm run dev
```

### STEP 3 — Buka Browser

```
http://localhost:5174
Email:    admin@mitraniagaindonesia.co.id
Password: Admin@MNI2024
```

⚠️ **GANTI PASSWORD setelah login pertama!**

---

## 🎯 FITUR YANG SUDAH ADA

| Halaman       | Fitur                                                              |
|---------------|--------------------------------------------------------------------|
| **Dashboard** | 4 metric cards, bar chart tren 30 hari, tabel 5 RFQ terbaru       |
| **Produk**    | List + CRUD + toggle Aktif/Unggulan + multi-gambar + spesifikasi   |
| **Layanan**   | List + CRUD + gambar inline                                        |
| **Portfolio** | List + CRUD + multi-foto proyek + toggle unggulan                  |
| **Berita**    | List + CRUD + toggle Draft/Published + cover image                 |
| **Testimoni** | CRUD via modal (tanpa pindah halaman)                              |
| **RFQ**       | Tab filter + detail modal + balas WA auto + tandai diproses        |
| **Pesan**     | Tab filter + detail modal + balas WA auto                          |

---

## 🌈 WARNA BRAND MNI (di Tailwind)

```
bg-navy-900     → Deep Navy (sidebar)
bg-amber-500    → Kuning Emas (CTA, badge)
bg-crimson-500  → Merah (bahaya, hapus)
bg-obsidian-800 → Hitam Obsidian (teks)
bg-surface      → Abu terang (background)
```

---

## 🏗️ ARSITEKTUR 3 APLIKASI

```
Pengunjung → FE (port 5173)  → /api (BE port 5000)
Admin      → CMS (port 5174) → /api/admin (BE port 5000) [JWT protected]
```

Untuk production, deploy:
- FE → domain utama: mitraniagaindonesia.co.id
- CMS → subdomain: cms.mitraniagaindonesia.co.id (atau /admin)
- BE → VPS: api.mitraniagaindonesia.co.id
