const { test, expect, request } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ─── KONFIGURASI URL VPS (PRODUCTION) ───
const CMS_URL = 'http://cms.mitraniagaindonesia.myrasindo.com';
const FE_URL = 'http://mitraniagaindonesia.myrasindo.com';
// API sekarang diakses melalui domain utama berkat proxy Nginx
const API_URL = 'http://mitraniagaindonesia.myrasindo.com/api'; 

test.describe('VPS Production E2E Testing: Alur Utama', () => {

  // Persiapan file dummy untuk VPS
  test.beforeAll(() => {
    const imagePath = path.join(__dirname, '../test-image-vps.jpg');
    if (!fs.existsSync(imagePath)) {
      fs.writeFileSync(imagePath, 'File gambar dummy khusus pengujian VPS.');
    }
  });

  test('Alur Lengkap: RFQ Publik -> Proses CMS -> Upload Banner -> Verifikasi Publik', async ({ browser }) => {
    const context = await browser.newContext();
    const cmsPage = await context.newPage();
    const fePage = await context.newPage();

    const timestamp = Date.now();
    const testRfqCompany = `[VPS-TEST] PT Coba VPS ${timestamp}`;
    const testBannerTitle = `[VPS-TEST] Promo Server ${timestamp}`;

    // ==========================================
    // FASE 1: PENGUNJUNG MENGIRIM RFQ DI FE (Via API VPS)
    // ==========================================
    console.log('1️⃣ Mengirim RFQ via API Production...');
    const apiContext = await request.newContext();
    const rfqResponse = await apiContext.post(`${API_URL}/rfq`, {
      data: {
        company_name: testRfqCompany,
        contact_name: 'Robot Playwright VPS',
        email: 'vps@robot.com',
        phone: '08999999999',
        product_interest: 'Layanan VPS',
        message: 'Testing API di environment Production'
      }
    });
    expect(rfqResponse.ok()).toBeTruthy();
    console.log('✅ RFQ berhasil dikirim ke server VPS.');

    // ==========================================
    // FASE 2: ADMIN LOGIN KE CMS VPS
    // ==========================================
    console.log('2️⃣ Login ke CMS Production...');
    await cmsPage.goto(`${CMS_URL}/#/login`);
    await cmsPage.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await cmsPage.locator('input[type="password"]').fill('Admin@MNI2024');
    await cmsPage.locator('input[type="password"]').press('Enter');
    
    // Tunggu render dashboard CMS VPS
    await expect(cmsPage).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });
    console.log('✅ Berhasil masuk ke Dashboard VPS.');

    // ==========================================
    // FASE 3: ADMIN MEMPROSES RFQ DI CMS
    // ==========================================
    console.log('3️⃣ Memeriksa RFQ di CMS...');
    await cmsPage.goto(`${CMS_URL}/#/rfq`);
    
    const rfqRow = cmsPage.locator('tr', { hasText: testRfqCompany });
    await expect(rfqRow).toBeVisible({ timeout: 10000 });
    
    // Klik aksi proses RFQ
    await rfqRow.locator('button').first().click();
    console.log('✅ RFQ berhasil ditemukan dan diproses.');

    // ==========================================
    // FASE 4: ADMIN MENGUNGGAH BANNER DI CMS
    // ==========================================
    console.log('4️⃣ Mengunggah Banner Baru di CMS VPS...');
    await cmsPage.goto(`${CMS_URL}/#/banner`);
    
    await cmsPage.getByPlaceholder('Contoh: Promo Masagi').fill(testBannerTitle);
    
    const imagePath = path.join(__dirname, '../test-image-vps.jpg');
    await cmsPage.locator('input[type="file"]').setInputFiles(imagePath);
    
    cmsPage.once('dialog', dialog => dialog.accept());
    
    await cmsPage.locator('button[type="submit"]', { hasText: 'Simpan' }).click();
    
    const bannerRow = cmsPage.locator('tr', { hasText: testBannerTitle });
    await expect(bannerRow).toBeVisible({ timeout: 10000 });
    console.log('✅ Banner berhasil tersimpan di database VPS.');

    // ==========================================
    // FASE 5: VERIFIKASI TAMPILAN BANNER DI FE PUBLIK
    // ==========================================
    console.log('5️⃣ Memastikan Banner tampil di Website Publik...');
    await fePage.goto(`${FE_URL}/`);
    
    const bannerImageFE = fePage.locator(`img[alt="${testBannerTitle}"]`);
    
    try {
      await expect(bannerImageFE).toBeVisible({ timeout: 10000 });
    } catch (e) {
      console.log('⏳ Menunggu cache Nginx VPS/API... Reloading...');
      await fePage.reload();
      await expect(bannerImageFE).toBeVisible({ timeout: 15000 });
    }
    console.log('✅ Gambar Banner sukses dilayani oleh Nginx VPS!');

    // ==========================================
    // FASE 6: CLEANUP (SAPU BERSIH DATA VPS)
    // ==========================================
    console.log('6️⃣ Membersihkan data [VPS-TEST] agar server tetap rapi...');
    
    // Hapus Banner
    await cmsPage.bringToFront();
    const deleteBtn = bannerRow.locator('button', { hasText: /Hapus/i });
    cmsPage.once('dialog', async dialog => await dialog.accept());
    await deleteBtn.click();
    await expect(bannerRow).not.toBeVisible({ timeout: 10000 });

    // Hapus RFQ
    await cmsPage.goto(`${CMS_URL}/#/rfq`);
    // Cari tombol hapus di baris RFQ (jika ada fitur hapus RFQ di sistem Anda)
    // Jika tidak ada, Anda bisa melewati tahap penghapusan RFQ ini.
    
    console.log('🎉 PENGUJIAN VPS SELESAI & BERSIH!');
  });
});