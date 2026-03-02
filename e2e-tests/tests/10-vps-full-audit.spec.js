const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ─── KONFIGURASI URL VPS (PRODUCTION) ───
const CMS_URL = 'http://cms.mitraniagaindonesia.myrasindo.com';
const FE_URL = 'http://mitraniagaindonesia.myrasindo.com';

test.describe.serial('VPS Master Audit: Seluruh Modul MNI', () => {

  // Buat file dummy sekali saja sebelum seluruh tes berjalan
  test.beforeAll(() => {
    const imagePath = path.join(__dirname, '../test-image-vps.jpg');
    if (!fs.existsSync(imagePath)) {
      fs.writeFileSync(imagePath, 'File gambar dummy khusus pengujian VPS lengkap.');
    }
  });

  test('Tur Validasi Seluruh Tab Sidebar CMS', async ({ page }) => {
    console.log('1️⃣ Memulai Tur Keliling CMS VPS...');
    await page.goto(`${CMS_URL}/#/login`);
    await page.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await page.locator('input[type="password"]').fill('Admin@MNI2024');
    await page.locator('input[type="password"]').press('Enter');
    
    await expect(page).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });
    
    // Daftar menu sesuai dengan urutan sidebar CMS Anda
    const menus = [
      { name: 'Banner & Promo', expectedHeader: 'Manajemen Banner' },
      { name: 'Produk', expectedHeader: 'Produk' },
      { name: 'Layanan', expectedHeader: 'Layanan' },
      { name: 'Portfolio', expectedHeader: 'Portfolio' },
      { name: 'Berita & Info', expectedHeader: 'Berita' },
      { name: 'Testimoni', expectedHeader: 'Testimoni' },
      { name: 'RFQ', expectedHeader: 'Request for Quotation' },
      { name: 'Pesan', expectedHeader: 'Pesan' },
      { name: 'Pengaturan Web', expectedHeader: 'Pengaturan Website' }
    ];

    for (const menu of menus) {
      // Klik menu di sidebar berdasarkan nama
      await page.getByRole('link', { name: new RegExp(menu.name, 'i') }).first().click();
      
      // Tunggu hingga elemen heading utama (h1/h2) berubah sesuai ekspektasi
      await expect(page.locator('h1, h2').filter({ hasText: new RegExp(menu.expectedHeader, 'i') }).first()).toBeVisible({ timeout: 10000 });
      console.log(`   ✅ Modul ${menu.name} berhasil dimuat tanpa error.`);
    }
  });

  test('Fungsionalitas: Upload Data Lintas Modul (Produk & Berita)', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const timestamp = Date.now();
    const testProductName = `[VPS-TEST] AC Split ${timestamp}`;
    const testNewsTitle = `[VPS-TEST] Rilis Teknologi Baru ${timestamp}`;

    // Login cepat
    await page.goto(`${CMS_URL}/#/login`);
    await page.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await page.locator('input[type="password"]').fill('Admin@MNI2024');
    await page.locator('input[type="password"]').press('Enter');
    await expect(page).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });

    // --- A. TEST MODUL PRODUK ---
    console.log('2️⃣ Menguji fungsionalitas Modul Produk...');
    await page.goto(`${CMS_URL}/#/produk`);
    await page.getByRole('button', { name: /tambah/i }).first().click();
    await page.locator('input:not([type="hidden"]):not([type="checkbox"])').first().fill(testProductName);
    
    // Upload gambar produk
    const imagePath = path.join(__dirname, '../test-image-vps.jpg');
    await page.locator('input[type="file"]').first().setInputFiles(imagePath);
    await page.locator('button[type="submit"], button:has-text("Simpan")').first().click();
    await expect(page.getByText(testProductName).first()).toBeVisible({ timeout: 15000 });
    console.log(`   ✅ Produk ${testProductName} berhasil ditambahkan.`);

    // --- B. TEST MODUL BERITA ---
    console.log('3️⃣ Menguji fungsionalitas Modul Berita...');
    await page.goto(`${CMS_URL}/#/berita`);
    
    const addNewsBtn = page.locator('a, button').filter({ hasText: /tambah|tulis/i }).first();
    await addNewsBtn.click();
    await page.locator('input:not([type="hidden"]):not([type="checkbox"])').first().fill(testNewsTitle);
    
    const textareas = await page.locator('textarea').all();
    for (const ta of textareas) {
      if (await ta.isVisible()) await ta.fill('Konten Berita VPS Test.');
    }
    
    // Nyalakan Publish
    const publishToggle = page.locator('button[role="switch"]').first();
    if (await publishToggle.count() > 0) {
      const isChecked = await publishToggle.getAttribute('aria-checked');
      if (isChecked !== 'true') await publishToggle.click();
    }
    
    await page.locator('button[type="submit"], button:has-text("Simpan")').first().click();
    await expect(page.getByText(testNewsTitle).first()).toBeVisible({ timeout: 15000 });
    console.log(`   ✅ Berita ${testNewsTitle} berhasil ditambahkan dan diterbitkan.`);

    // --- C. VERIFIKASI KE FRONTEND PUBLIK ---
    console.log('4️⃣ Verifikasi Sinkronisasi ke Frontend VPS...');
    const fePage = await context.newPage();
    await fePage.goto(`${FE_URL}/#/produk`);
    try {
      await expect(fePage.getByText(testProductName).first()).toBeVisible({ timeout: 10000 });
    } catch (e) {
      await fePage.reload();
      await expect(fePage.getByText(testProductName).first()).toBeVisible({ timeout: 10000 });
    }
    console.log('   ✅ Frontend tersinkronisasi sempurna!');
  });

  test('Sapu Bersih Data Uji Coba (Cleanup)', async ({ page }) => {
    console.log('5️⃣ Melakukan Sapu Bersih Data Uji Coba di VPS...');
    await page.goto(`${CMS_URL}/#/login`);
    await page.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await page.locator('input[type="password"]').fill('Admin@MNI2024');
    await page.locator('input[type="password"]').press('Enter');
    await expect(page).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });

    const modulesToClean = [
      { url: `${CMS_URL}/#/produk`, name: 'Produk' },
      { url: `${CMS_URL}/#/berita`, name: 'Berita' }
    ];

    for (const mod of modulesToClean) {
      await page.goto(mod.url);
      await page.waitForTimeout(2000); // Tunggu tabel ter-render
      
      while (true) {
        const row = page.locator('tr', { hasText: '[VPS-TEST]' }).first();
        if (await row.count() === 0) break;
        
        await row.locator('button').last().click(); // Asumsi tombol hapus di paling kanan
        
        const confirmBtn = page.locator('button').filter({ hasText: /ya, lanjutkan|hapus|ya/i }).last();
        await expect(confirmBtn).toBeVisible({ timeout: 5000 });
        await confirmBtn.click();
        
        await expect(row).not.toBeVisible({ timeout: 5000 });
        await page.waitForTimeout(500); // Delay aman untuk database
      }
      console.log(`   🧹 Modul ${mod.name} bersih.`);
    }
    console.log('🎉 PENGUJIAN VPS KOMPREHENSIF SELESAI!');
  });
});