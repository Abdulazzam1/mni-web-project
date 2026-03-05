const { test, expect } = require('@playwright/test');

test.describe('Audit Fungsionalitas MNI: CMS ke FE', () => {
  test('Flow Lengkap: Login, Buat Konten, dan Verifikasi Publik', async ({ browser }) => {
    const context = await browser.newContext();
    const cmsPage = await context.newPage();
    const fePage  = await context.newPage();

    // 1. LOGIN CMS - Verifikasi Keamanan JWT
    await cmsPage.goto('http://localhost:5174/#/login');
    await cmsPage.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await cmsPage.locator('input[type="password"]').fill('Admin@MNI2024');
    
    // PERBAIKAN: Tekan 'Enter' langsung pada input password untuk memicu submit secara presisi
    await cmsPage.locator('input[type="password"]').press('Enter');
    
    // Verifikasi AuthContext berhasil menyimpan token
    await expect(cmsPage).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });

    // 2. NAVIGASI KE PRODUK (Mendukung HashRouter) 
    await cmsPage.getByRole('link', { name: /produk/i }).first().click();
    
    // ─── PERBAIKAN ERROR STRICT MODE DI SINI ───
    // Menggunakan .first() agar Playwright tidak bingung saat ada 2 tombol "Tambah"
    await cmsPage.getByRole('button', { name: /tambah/i }).first().click();
    // ───────────────────────────────────────────

    // 3. PENGISIAN FORM (Targeting Spesifik) 
    const productName = `[TEST] Produk MNI ${Date.now()}`;
    const nameInput = cmsPage.locator('input[name="name"], input').first();
    await expect(nameInput).toBeVisible({ timeout: 10000 });
    await nameInput.fill(productName);
    
    // ─── FIX: Pilih Kategori Terlebih Dahulu Sebelum Disimpan ───
    await cmsPage.waitForTimeout(1500); // Tunggu API kategori ter-load
    const categorySelect = cmsPage.locator('select[name="category"]');
    if (await categorySelect.count() > 0) {
      // Pilih opsi index 1 (karena index 0 biasanya teks "-- Pilih Kategori --")
      await categorySelect.selectOption({ index: 1 });
    }
    // ────────────────────────────────────────────────────────────

    // PERBAIKAN: Tekan 'Enter' untuk menyimpan form dengan akurasi 100%
    await nameInput.press('Enter');
    
    // PERBAIKAN KRUSIAL: Tambahkan batas waktu 2 detik. Jika Enter berhasil memindahkan halaman, 
    // robot tidak akan nge-hang 30 detik untuk mencari tombol yang sudah hilang.
    await cmsPage.locator('button[type="submit"], button:has-text("Simpan")').first().click({ timeout: 2000 }).catch(() => {});
    
    // Tunggu proses backend
    await cmsPage.waitForTimeout(3000); 

    // 4. VERIFIKASI LINTAS PORT (BE 5001 -> FE 5173)
    await fePage.goto('http://localhost:5173/produk');
    
    const isVisible = await fePage.getByText(productName).isVisible();
    if (!isVisible) {
      await fePage.goto('http://localhost:5173/#/produk');
    }

    // PERBAIKAN FLAKY: Mekanisme Auto-Reload jika database FE terlambat sinkron
    try {
      await expect(fePage.getByText(productName).first()).toBeVisible({ timeout: 5000 });
    } catch (error) {
      console.log('⏳ Delay sinkronisasi database terdeteksi. Memuat ulang halaman FE...');
      await fePage.waitForTimeout(2000); // Beri waktu ekstra untuk API & Database
      await fePage.reload(); // Refresh browser
    }

    // Pengecekan Final
    await expect(fePage.getByText(productName).first()).toBeVisible({ timeout: 15000 });
    console.log(`✅ Fungsionalitas Terverifikasi: ${productName} Sinkron!`);
  });

  test('Security Test: Akses Admin Tanpa Token Harus Ditolak', async ({ page }) => {
    await page.goto('http://localhost:5174/#/rfq'); 
    await expect(page).toHaveURL(/.*login.*/i, { timeout: 15000 });
    console.log('✅ Security: Unauthorized access blocked.');
  });
});