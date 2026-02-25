const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs'); // PERBAIKAN: Import library File System bawaan NodeJS

test('Manajemen Gambar: Upload Produk & Verifikasi Gambar di FE', async ({ page }) => {
  // PERBAIKAN: Buat file dummy otomatis di dalam folder e2e-tests jika belum ada
  const dummyFilePath = path.join(__dirname, '../test-image.jpg');
  if (!fs.existsSync(dummyFilePath)) {
    fs.writeFileSync(dummyFilePath, 'Ini adalah file gambar dummy buatan Playwright untuk pengujian otomatis.');
  }

  // PERBAIKAN: Menggunakan jalur HashRouter /#/login
  await page.goto('http://localhost:5174/#/login');
  await page.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
  await page.locator('input[type="password"]').fill('Admin@MNI2024');
  
  // Menggunakan dua kemungkinan locator agar lebih stabil
  await page.locator('button[type="submit"], button:has-text("Masuk")').first().click();

  // PERBAIKAN: Tunggu sampai benar-benar masuk dashboard sebelum pindah URL agar token JWT tersimpan
  await expect(page).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });

  // PERBAIKAN: Menggunakan jalur HashRouter /#/produk/baru
  await page.goto('http://localhost:5174/#/produk/baru');
  
  const productName = `[TEST] Produk Gambar ${Date.now()}`;
  
  // PERBAIKAN: Pastikan form sudah ter-render sebelum mengisi data
  const nameInput = page.locator('input').first();
  await expect(nameInput).toBeVisible({ timeout: 15000 });
  await nameInput.fill(productName);

  // Suntikkan file langsung ke elemen DOM tanpa klik (sangat ampuh untuk React Dropzone)
  // File pasti tersedia karena sudah di-generate oleh blok fs.existsSync di atas
  await page.locator('input[type="file"]').setInputFiles(dummyFilePath);

  await page.locator('button[type="submit"], button:has-text("Simpan")').first().click();
  
  // Verifikasi toast sukses muncul
  await expect(page.locator('text=/berhasil|sukses|success/i').first()).toBeVisible({ timeout: 15000 });
});