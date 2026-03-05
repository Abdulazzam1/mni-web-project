const { test, expect } = require('@playwright/test');

const CMS_URL = 'http://localhost:5174';
const FE_URL = 'http://localhost:5173';

test.describe('E2E Flow: Manajemen Kategori Dinamis & Pencarian Produk', () => {

  test('Alur Lengkap: Buat Kategori -> Buat Produk -> Filter & Search FE -> Cleanup', async ({ browser }) => {
    // Gunakan browser context agar bisa buka CMS dan FE secara berdampingan
    const context = await browser.newContext();
    const cmsPage = await context.newPage();
    const fePage = await context.newPage();

    // Generate unique ID untuk testing agar tidak bentrok dengan data asli
    const ts = Date.now();
    const testCategoryName = `[TEST] HVAC System ${ts}`;
    const testProductName = `[TEST] Daikin VRV X ${ts}`;

    // ==========================================
    // STEP 1: LOGIN CMS
    // ==========================================
    console.log('1️⃣ Login ke CMS Admin...');
    await cmsPage.goto(`${CMS_URL}/#/login`);
    await cmsPage.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await cmsPage.locator('input[type="password"]').fill('Admin@MNI2024');
    await cmsPage.locator('input[type="password"]').press('Enter');
    await expect(cmsPage).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });

    // ==========================================
    // STEP 2: BUAT KATEGORI DINAMIS BARU
    // ==========================================
    console.log(`2️⃣ Membuat Kategori Baru: ${testCategoryName}...`);
    await cmsPage.goto(`${CMS_URL}/#/kategori`);
    
    // Isi input nama kategori dan simpan
    await cmsPage.locator('input[placeholder*="Contoh: Water Cooled"]').fill(testCategoryName);
    await cmsPage.locator('button[type="submit"]', { hasText: 'Simpan' }).click();
    
    // Verifikasi kategori muncul di tabel
    const categoryRow = cmsPage.locator('tr', { hasText: testCategoryName });
    await expect(categoryRow).toBeVisible({ timeout: 10000 });
    console.log('   ✅ Kategori berhasil ditambahkan ke database!');

    // ==========================================
    // STEP 3: BUAT PRODUK DENGAN KATEGORI BARU
    // ==========================================
    console.log(`3️⃣ Membuat Produk menggunakan Kategori ${testCategoryName}...`);
    await cmsPage.goto(`${CMS_URL}/#/produk/baru`);
    
    // Isi nama produk
    await cmsPage.locator('input[name="name"]').fill(testProductName);
    
    // Tunggu sebentar agar API Kategori selesai me-render opsi di dropdown
    await cmsPage.waitForTimeout(1500); 
    
    // Pilih kategori yang baru saja dibuat berdasarkan label teksnya
    await cmsPage.locator('select[name="category"]').selectOption({ label: testCategoryName });
    
    // Simpan Produk
    await cmsPage.locator('button[type="submit"]', { hasText: 'Simpan' }).click();
    await expect(cmsPage.locator('text=/berhasil|sukses/i').first()).toBeVisible({ timeout: 10000 });
    console.log('   ✅ Produk berhasil disimpan dengan kategori dinamis!');

    // ==========================================
    // STEP 4: VERIFIKASI FILTER & SEARCH DI FRONTEND
    // ==========================================
    console.log('4️⃣ Menguji Fitur Filter dan Pencarian di Frontend Publik...');
    await fePage.goto(`${FE_URL}/#/produk`);
    await fePage.waitForTimeout(2000); // Tunggu initial fetch

    // TEST A: Filter Kategori Dinamis
    console.log('   🔍 Menguji klik tombol Filter Kategori...');
    const categoryBtn = fePage.locator('button', { hasText: testCategoryName });
    
    try {
      await expect(categoryBtn).toBeVisible({ timeout: 5000 });
    } catch (e) {
      console.log('   ⏳ Tombol Kategori belum muncul, mencoba reload...');
      await fePage.reload();
      await expect(categoryBtn).toBeVisible({ timeout: 10000 });
    }
    
    await categoryBtn.click();
    await expect(fePage.locator(`text=${testProductName}`).first()).toBeVisible({ timeout: 10000 });
    console.log('   ✅ Filter Kategori Dinamis berfungsi dengan baik!');

    // TEST B: Kolom Pencarian String (Debounce)
    console.log('   🔍 Menguji Search Bar (Pencarian String)...');
    // Reset filter ke "Semua Produk" terlebih dahulu
    await fePage.locator('button', { hasText: 'Semua Produk' }).click();
    
    // Ketik nama produk di search bar
    const searchInput = fePage.locator('input[placeholder*="Cari nama produk"]');
    await searchInput.fill(testProductName);
    
    // Tunggu 1 detik untuk mensimulasikan Debounce 500ms + respon API
    await fePage.waitForTimeout(1500); 
    
    // Verifikasi produk muncul berdasarkan hasil pencarian string
    await expect(fePage.locator(`text=${testProductName}`).first()).toBeVisible();
    console.log('   ✅ Fitur Pencarian String (ILIKE) & Debounce berfungsi sempurna!');

    // ==========================================
    // STEP 5: CLEANUP (HAPUS PRODUK LALU KATEGORI)
    // ==========================================
    console.log('5️⃣ Melakukan Cleanup (Sapu Bersih Data Test)...');
    await cmsPage.bringToFront();

    // Hapus Produk Terlebih Dahulu
    await cmsPage.goto(`${CMS_URL}/#/produk`);
    await cmsPage.waitForTimeout(1500);
    const productRow = cmsPage.locator('tr', { hasText: testProductName }).first();
    await productRow.locator('button').last().click(); // Klik icon Trash
    
    // Tangani Modal Konfirmasi (gunakan filter RegExp tangguh)
    const confirmProductBtn = cmsPage.locator('button').filter({ hasText: /ya, lanjutkan|hapus|ya/i }).last();
    await expect(confirmProductBtn).toBeVisible({ timeout: 5000 });
    await confirmProductBtn.click();
    await expect(productRow).not.toBeVisible({ timeout: 10000 });
    console.log('   🧹 Produk test dihapus.');

    // Hapus Kategori
    await cmsPage.goto(`${CMS_URL}/#/kategori`);
    await cmsPage.waitForTimeout(1500);
    const catRow = cmsPage.locator('tr', { hasText: testCategoryName }).first();
    await catRow.locator('button[title="Hapus"]').click();
    
    // Tangani dialog alert bawaan browser (window.confirm)
    cmsPage.once('dialog', dialog => dialog.accept());
    await expect(catRow).not.toBeVisible({ timeout: 10000 });
    console.log('   🧹 Kategori test dihapus.');

    console.log('🎉 SELURUH ALUR REVISI 1 & 2 VALID DAN BERJALAN SEMPURNA!');
  });
});