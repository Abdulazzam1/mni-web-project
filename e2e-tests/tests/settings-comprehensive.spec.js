const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Konfigurasi URL
const CMS_URL = 'http://localhost:5174';
const FE_URL = 'http://localhost:5173';

test.describe('Comprehensive Web Settings & Profile Flow', () => {
  
  test('Harus dapat memperbarui seluruh profil web dan sinkron ke Frontend', async ({ browser }) => {
    const context = await browser.newContext();
    const cms = await context.newPage();
    const fe = await context.newPage();

    // 1. LOGIN KE CMS
    await cms.goto(`${CMS_URL}/#/login`);
    await cms.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await cms.locator('input[type="password"]').fill('Admin@MNI2024');
    await cms.click('button[type="submit"]');
    await expect(cms).toHaveURL(/.*dashboard.*/i);

    // 2. NAVIGASI KE PENGATURAN & TUNGGU LOADING
    await cms.goto(`${CMS_URL}/#/settings`);
    
    // Tunggu hingga teks loading "Memuat pengaturan..." hilang
    await expect(cms.locator('text=Memuat pengaturan...')).not.toBeVisible({ timeout: 15000 });
    await expect(cms.locator('h1')).toContainText('Pengaturan Website');

    // PREPARASI DATA TEST (Dinamis dengan Timestamp)
    const ts = Date.now();
    const testData = {
      phone: `(021) 555-${ts.toString().slice(-4)}`,
      email: `test-${ts}@mni.co.id`,
      title: `Solusi Teknik Terintegrasi ${ts}`,
      desc: `Paragraf Pertama ${ts}||Paragraf Kedua ${ts}`,
      vision: `Visi Masa Depan ${ts}`,
      mission: `Misi Satu ${ts}||Misi Dua ${ts}`,
      valueTitle: `Inovasi ${ts}`,
      valueDesc: `Selalu berinovasi dalam teknologi VAC ${ts}`
    };

    // 3. EDIT INFORMASI KONTAK (Selector Tangguh)
    await cms.locator('div:has(> label:has-text("No. Telp Sales")) >> input').first().fill(testData.phone);
    await cms.locator('div:has(> label:has-text("Email")) >> input').first().fill(testData.email);

    // 4. UPLOAD GAMBAR TENTANG KAMI
    const testImagePath = path.join(__dirname, 'test-assets', 'about-test.jpg');
    if (fs.existsSync(testImagePath)) {
      await cms.locator('input[type="file"]').setInputFiles(testImagePath);
    } else {
      console.log('⚠️ File gambar test tidak ditemukan, melewati tahap upload.');
    }

    // 5. EDIT STATISTIK
    await cms.locator('div:has(> label:has-text("Total Proyek")) >> input').fill('700+');
    await cms.locator('div:has(> label:has-text("Total Klien")) >> input').fill('350+');

    // 6. MANIPULASI NILAI-NILAI KAMI (JSON Editor)
    await cms.getByRole('button', { name: /Tambah Nilai Baru/i }).click();
    
    // Isi nilai terakhir yang baru saja ditambahkan
    const valueInputs = cms.locator('input[placeholder*="Judul Nilai"]');
    const valueTexts = cms.locator('textarea[placeholder*="Deskripsi singkat"]');
    const count = await valueInputs.count();
    
    await valueInputs.nth(count - 1).fill(testData.valueTitle);
    await valueTexts.nth(count - 1).fill(testData.valueDesc);

    // 7. EDIT VISI, MISI & PROFIL
    await cms.locator('div:has(> label:has-text("Judul Utama Profil")) >> input').fill(testData.title);
    await cms.locator('div:has(> label:has-text("Deskripsi Tentang Kami")) >> textarea').fill(testData.desc);
    await cms.locator('div:has(> label:has-text("Visi")) >> textarea').fill(testData.vision);
    await cms.locator('div:has(> label:has-text("Misi")) >> textarea').fill(testData.mission);

    // 8. SIMPAN PERUBAHAN
    await cms.getByRole('button', { name: /Simpan Perubahan/i }).click();
    await expect(cms.locator('text=Pengaturan berhasil diperbarui')).toBeVisible({ timeout: 15000 });

    // ==========================================
    // 9. VERIFIKASI DI FRONTEND (FE)
    // ==========================================
    await fe.goto(FE_URL);
    await fe.waitForTimeout(3000); // Tunggu sinkronisasi context

    // A. Cek Header
    await expect(fe.locator('header')).toContainText(testData.phone);

    // B. Cek Halaman Tentang Kami
    await fe.goto(`${FE_URL}/#/tentang-kami`);
    
    // Verifikasi Judul Profil (Gunakan .first() untuk menghindari Strict Mode violation dengan judul Values)
    const profileTitle = fe.locator('h2').first(); 
    await expect(profileTitle).toContainText(testData.title);

    // Verifikasi Deskripsi (Paragraf Pertama)
    const firstParagraph = testData.desc.split('||')[0];
    await expect(fe.locator(`text=${firstParagraph}`)).toBeVisible();

    // Verifikasi Gambar (Pastikan URL bersih tanpa double /uploads/)
    const aboutImg = fe.locator('img[alt="Tentang MNI"]');
    await expect(aboutImg).toBeVisible();
    const imgSrc = await aboutImg.getAttribute('src');
    expect(imgSrc).not.toContain('/uploads//uploads/');
    expect(imgSrc).toMatch(/\/uploads\/misc\//);

    // Verifikasi Nilai Baru
    await expect(fe.locator(`h4:has-text("${testData.valueTitle}")`)).toBeVisible();

    console.log('✅ Automated Test Berhasil: Data tersinkronisasi dan selector spesifik.');
  });
});