const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('E2E Flow: Manajemen Banner & Promo', () => {

  // Pastikan file gambar dummy tersedia sebelum test dijalankan
  test.beforeAll(() => {
    const imagePath = path.join(__dirname, '../test-image.jpg');
    if (!fs.existsSync(imagePath)) {
      // Jika tidak ada gambar dummy, buat file teks palsu dengan ekstensi jpg
      fs.writeFileSync(imagePath, 'dummy content');
    }
  });

  test('Upload dari CMS, tampil di Beranda FE, lalu Hapus', async ({ context }) => {
    const pageCMS = await context.newPage();
    const pageFE = await context.newPage();

    // ==========================================
    // STEP 1: LOGIN & UPLOAD BANNER DI CMS
    // ==========================================
    console.log('1️⃣ Masuk ke CMS Admin...');
    await pageCMS.goto('http://localhost:5174/#/login');
    await pageCMS.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await pageCMS.locator('input[type="password"]').fill('Admin@MNI2024');
    await pageCMS.locator('input[type="password"]').press('Enter');
    
    // Tunggu masuk dashboard, lalu ke halaman Banner
    await expect(pageCMS).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });
    await pageCMS.goto('http://localhost:5174/#/banner');
    
    console.log('2️⃣ Mengunggah Banner [TEST]...');
    const testTitle = `[TEST] Promo Masagi ${Date.now()}`;
    
    // Isi form judul
    await pageCMS.getByPlaceholder('Contoh: Promo Masagi').fill(testTitle);
    
    // Upload file gambar
    const imagePath = path.join(__dirname, '../test-image.jpg');
    await pageCMS.locator('#banner-image').setInputFiles(imagePath);
    
    // PERBAIKAN: Tangkap alert sukses SEKALI SAJA tepat sebelum klik tombol
    pageCMS.once('dialog', dialog => dialog.accept());
    
    // Klik Simpan
    const submitBtn = pageCMS.locator('button[type="submit"]', { hasText: 'Simpan' });
    await submitBtn.click();
    
    // Verifikasi banner masuk ke tabel CMS
    const bannerRow = pageCMS.locator('tr', { hasText: testTitle });
    await expect(bannerRow).toBeVisible({ timeout: 10000 });
    console.log(`✅ Banner berhasil diunggah di CMS: ${testTitle}`);

    // ==========================================
    // STEP 2: CEK TAMPILAN DI FRONTEND PUBLIK
    // ==========================================
    console.log('3️⃣ Mengecek Banner di Frontend (Beranda)...');
    await pageFE.goto('http://localhost:5173/'); // Sesuaikan jika ada hash /#/
    
    // Cari gambar banner berdasarkan alt text-nya
    const bannerImageFE = pageFE.locator(`img[alt="${testTitle}"]`);
    
    try {
      // Tunggu maksimal 10 detik agar API selesai fetching
      await expect(bannerImageFE).toBeVisible({ timeout: 10000 });
      console.log('✅ Banner [TEST] berhasil tayang di Beranda Frontend!');
    } catch (e) {
      console.log('⏳ Banner belum muncul di FE, mencoba reload...');
      await pageFE.reload();
      await expect(bannerImageFE).toBeVisible({ timeout: 10000 });
      console.log('✅ Banner [TEST] tayang setelah reload!');
    }

    // ==========================================
    // STEP 3: CLEANUP (HAPUS DATA DARI CMS)
    // ==========================================
    console.log('4️⃣ Menghapus Banner [TEST] dari CMS (Cleanup)...');
    await pageCMS.bringToFront();
    
    // Klik tombol hapus di baris yang tepat
    const deleteBtn = bannerRow.locator('button', { hasText: /Hapus/i });
    
    // PERBAIKAN: Tangkap konfirmasi window.confirm('Yakin ingin menghapus...') SEKALI SAJA
    pageCMS.once('dialog', async dialog => {
      await dialog.accept();
    });
    
    await deleteBtn.click();
    
    // Pastikan baris hilang dari tabel CMS
    await expect(bannerRow).not.toBeVisible({ timeout: 10000 });
    console.log('✅ Banner [TEST] berhasil dihapus dari CMS.');

    // ==========================================
    // STEP 4: PASTIKAN HILANG DI FRONTEND
    // ==========================================
    console.log('5️⃣ Memastikan Banner hilang dari Beranda Frontend...');
    await pageFE.bringToFront();
    await pageFE.reload();
    await expect(bannerImageFE).not.toBeVisible({ timeout: 10000 });
    console.log('✅ CLEANUP SELESAI: Frontend kembali bersih!');
    
  });
});