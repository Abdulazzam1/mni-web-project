const { test, expect } = require('@playwright/test');

test.describe('E2E Flow: Pengaturan Website (Web Settings)', () => {
  test('Update Profil & Kontak di CMS dan Verifikasi di FE', async ({ browser }) => {
    const context = await browser.newContext();
    const cmsPage = await context.newPage();
    const fePage = await context.newPage();

    // ==========================================
    // STEP 1: LOGIN CMS & NAVIGASI KE SETTINGS
    // ==========================================
    console.log('1️⃣ Login ke CMS Admin...');
    await cmsPage.goto('http://localhost:5174/#/login');
    await cmsPage.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await cmsPage.locator('input[type="password"]').fill('Admin@MNI2024');
    await cmsPage.locator('input[type="password"]').press('Enter');

    await expect(cmsPage).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });
    
    // Menuju halaman settings
    await cmsPage.goto('http://localhost:5174/#/settings');
    console.log('2️⃣ Mengubah data kontak dan profil...');

    const timestamp = Date.now();
    const newSalesPhone = `(021) 9999-${timestamp.toString().slice(-4)}`;
    const newVision = `Menjadi perusahaan terdepan dengan inovasi teknologi ${timestamp}`;

    // Mengisi Form Pengaturan
    await cmsPage.locator('input[name="contact_sales"]').fill(newSalesPhone);
    await cmsPage.locator('textarea[name="vision"]').fill(newVision);

    // Klik Simpan
    const saveBtn = cmsPage.getByRole('button', { name: /simpan/i });
    await saveBtn.click();

    // Verifikasi pesan sukses di CMS
    await expect(cmsPage.locator('text=Pengaturan berhasil diperbarui')).toBeVisible({ timeout: 10000 });
    console.log(`✅ Perubahan disimpan: Sales ${newSalesPhone}`);

    // ==========================================
    // STEP 2: VERIFIKASI DI FRONTEND (HEADER & ABOUT)
    // ==========================================
    console.log('3️⃣ Verifikasi perubahan di Frontend Publik...');
    
    // Cek Nomor Telepon di Header (Berlaku di semua halaman)
    await fePage.goto('http://localhost:5173/');
    await fePage.reload(); // Refresh untuk memastikan Context mengambil data terbaru
    
    const headerPhone = fePage.locator('header').getByText(newSalesPhone);
    await expect(headerPhone).toBeVisible({ timeout: 10000 });
    console.log('✅ Nomor Telepon di Header sinkron!');

    // Cek Visi di Halaman Tentang Kami
    await fePage.goto('http://localhost:5173/#/tentang-kami');
    const visionText = fePage.locator('text=' + newVision);
    await expect(visionText).toBeVisible({ timeout: 10000 });
    console.log('✅ Teks Visi di About Page sinkron!');

    // ==========================================
    // STEP 3: CLEANUP (KEMBALIKAN KE DATA ASLI)
    // ==========================================
    console.log('4️⃣ Mengembalikan data ke semula (Cleanup)...');
    await cmsPage.bringToFront();
    await cmsPage.locator('input[name="contact_sales"]').fill('(021) 1234-5678');
    await cmsPage.locator('textarea[name="vision"]').fill('Menjadi perusahaan distribusi dan layanan teknis VAC, Mekanikal, dan Elektrikal terpercaya dan terdepan di Indonesia.');
    await saveBtn.click();
    
    await expect(cmsPage.locator('text=Pengaturan berhasil diperbarui')).toBeVisible();
    console.log('✅ Cleanup selesai.');
  });
});