const { test, expect } = require('@playwright/test');

test.describe('Audit Validasi Form (Stress Test)', () => {
  test('Validasi Form Login: Email Kosong & Salah', async ({ page }) => {
    await page.goto('http://localhost:5174/login');
    
    // Test 1: Submit Kosong
    await page.locator('button[type="submit"]').click();
    // Cari teks peringatan merah dari React
    await expect(page.locator('text=/wajib|kosong|required/i').first()).toBeVisible({ timeout: 5000 });

    // Test 2: Format Email Salah
    await page.locator('input[type="email"]').fill('bukan-email-mni');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=/valid|format/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('Validasi Produk: Nama Kosong', async ({ page }) => {
    await page.goto('http://localhost:5174/login');
    await page.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await page.locator('input[type="password"]').fill('Admin@MNI2024');
    await page.locator('button[type="submit"]').click();

    await page.goto('http://localhost:5174/produk/baru');
    
    // Langsung klik simpan tanpa mengisi data
    await page.locator('button[type="submit"]').click();
    
    // Verifikasi muncul pesan error
    await expect(page.locator('text=/wajib|harus diisi|required/i').first()).toBeVisible({ timeout: 5000 });
  });
});