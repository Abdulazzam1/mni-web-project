const { test, expect } = require('@playwright/test');

test.describe('Testing Modul Lengkap MNI', () => {
  test.beforeEach(async ({ page }) => {
    // Login Global sebelum setiap tes modul
    await page.goto('http://localhost:5174/#/login');
    await page.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await page.locator('input[type="password"]').fill('Admin@MNI2024');
    
    // Beri jeda sangat sebentar sebelum menekan tombol masuk
    await page.waitForTimeout(500); 
    await page.locator('button[type="submit"], button:has-text("Masuk")').first().click();
    
    await expect(page).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });
  });

  test('Modul Berita: Create & Verify', async ({ page, browser }) => {
    const title = `[TEST] Berita MNI ${Date.now()}`;
    
    await page.getByRole('link', { name: /berita|news/i }).first().click();
    await page.waitForTimeout(2000);

    const addButton = page.locator('a, button').filter({ hasText: /tambah|baru|add|create|buat|tulis|post/i })
      .or(page.locator('[aria-label*="tambah" i], [aria-label*="add" i], [title*="tambah" i], [title*="add" i]'));
    await addButton.first().click();
    
    // Mengisi judul di input text pertama
    await page.locator('input:not([type="hidden"]):not([type="checkbox"])').first().fill(title);
    
    // Sapu bersih semua textarea di form berita
    const textareas = await page.locator('textarea').all();
    for (const ta of textareas) {
      if (await ta.isVisible()) {
        await ta.fill('Konten berita testing otomatis oleh Playwright. Paragraf ini untuk memenuhi validasi form Backend.');
      }
    }
    
    const richText = page.locator('[contenteditable="true"]');
    if (await richText.count() > 0) {
      await richText.first().fill('Konten berita testing dari Rich Text Editor untuk validasi Playwright.');
    }

    // PERBAIKAN KRUSIAL: Nyalakan toggle "Publish" / "Aktif" agar berita tayang di Frontend Publik
    const publishToggle = page.locator('button[role="switch"]').first();
    if (await publishToggle.count() > 0) {
      const isChecked = await publishToggle.getAttribute('aria-checked');
      if (isChecked !== 'true') {
        await publishToggle.click(); // Klik untuk menyalakan jika masih OFF (Draft)
      }
    } else {
      // Fallback jika menggunakan dropdown status (misal: pilih index 1 yang biasanya "Publish/Aktif")
      const statusSelect = page.locator('select');
      if (await statusSelect.count() > 0) {
        await statusSelect.first().selectOption({ index: 1 }).catch(() => {});
      }
    }
    
    // Klik tombol Simpan dengan pasti
    const submitBtn = page.locator('button[type="submit"], button:has-text("Simpan")').first();
    await submitBtn.click();
    
    // Tunggu animasi loading proses penyimpanan ke Backend selesai
    await page.waitForTimeout(3000);
    
    // Jika CMS tidak auto-redirect, paksa kembali ke tabel
    if (page.url().includes('baru') || page.url().includes('create') || page.url().includes('edit')) {
      await page.getByRole('link', { name: /berita|news/i }).first().click();
      await page.waitForTimeout(2000);
    }

    // Verifikasi di CMS List
    await expect(page.getByText(title).first()).toBeVisible({ timeout: 15000 });

    // Verifikasi di FE Publik
    const fePage = await browser.newPage();
    
    // Langsung tembak URL presisi sesuai gambar Frontend
    await fePage.goto('http://localhost:5173/#/informasi'); 
    await fePage.waitForTimeout(2000); 
    
    // Pastikan Tab 'Berita' aktif 
    await fePage.locator('button, li').filter({ hasText: /^Berita$/i }).click().catch(() => {});
    
    // Mekanisme Auto-Reload jika data API terlambat masuk
    try {
      await expect(fePage.getByText(title).first()).toBeVisible({ timeout: 5000 });
    } catch (error) {
      console.log('⏳ Delay sinkronisasi database terdeteksi. Memuat ulang halaman FE...');
      await fePage.reload(); 
      await fePage.waitForTimeout(2000); 
      await fePage.locator('button, li').filter({ hasText: /^Berita$/i }).click().catch(() => {});
    }
    
    await expect(fePage.getByText(title).first()).toBeVisible({ timeout: 15000 });
  });

  test('Modul Portofolio: Create & Verify', async ({ page }) => {
    const title = `[TEST] Proyek Gedung ${Date.now()}`;
    await page.getByRole('link', { name: /portfolio/i }).click();
    await page.waitForTimeout(1000);

    await page.locator('a, button').filter({ hasText: /tambah|baru|add|create/i }).first().click();
    
    await page.locator('input:not([type="hidden"]):not([type="checkbox"])').first().fill(title);

    const textareas = await page.locator('textarea').all();
    for (const ta of textareas) {
      if (await ta.isVisible()) {
        await ta.fill('Deskripsi proyek testing otomatis.');
      }
    }

    // PERBAIKAN: Nyalakan toggle aktif untuk Portofolio jika ada
    const publishToggle = page.locator('button[role="switch"]').first();
    if (await publishToggle.count() > 0) {
      const isChecked = await publishToggle.getAttribute('aria-checked');
      if (isChecked !== 'true') {
        await publishToggle.click();
      }
    }

    // Klik simpan
    await page.locator('button[type="submit"], button:has-text("Simpan")').first().click();
    await page.waitForTimeout(3000);
    
    // Paksa kembali ke tabel jika tidak auto-redirect
    if (page.url().includes('baru') || page.url().includes('create') || page.url().includes('edit')) {
      await page.getByRole('link', { name: /portfolio/i }).first().click();
      await page.waitForTimeout(2000);
    }

    // Verifikasi di CMS List
    await expect(page.getByText(title).first()).toBeVisible({ timeout: 15000 });
  });
});