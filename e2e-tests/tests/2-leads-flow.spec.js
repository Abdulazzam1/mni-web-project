const { test, expect, request } = require('@playwright/test');

test.describe('Alur Leads: Pengiriman RFQ (FE -> CMS)', () => {
  test('Pengunjung submit RFQ di FE, Admin memprosesnya di CMS', async ({ page }) => {
    // ─── FASE 1: Simulasi FE ───
    const apiContext = await request.newContext();
    const rfqResponse = await apiContext.post('http://localhost:5001/api/rfq', {
      data: {
        company_name: '[TEST] PT Maju Mundur',
        contact_name: 'Robot Playwright',
        email: 'robot@test.com',
        phone: '081234567890',
        product_interest: 'Layanan Instalasi',
        message: 'Mohon penawaran untuk instalasi gedung'
      }
    });
    expect(rfqResponse.ok()).toBeTruthy();

    // ─── FASE 2: CMS ───
    await page.goto('http://localhost:5174/login');
    
    // Login menggunakan tipe input
    await page.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
    await page.locator('input[type="password"]').fill('Admin@MNI2024');
    await page.locator('button:has-text("Masuk")').click();

    // Tunggu Dashboard
    await expect(page.locator('h1')).toContainText(/Dashboard/i, { timeout: 15000 });

    // Klik RFQ di Sidebar
    await page.getByRole('link', { name: /rfq/i }).click();
    
    // Cari baris tabel
    const targetRow = page.locator('tr', { hasText: '[TEST] PT Maju Mundur' });
    await expect(targetRow).toBeVisible({ timeout: 10000 });
    
    // Klik tombol aksi pertama di baris tersebut (Biasanya tombol proses/view)
    await targetRow.locator('button').first().click(); 

    await page.waitForTimeout(2000);
  });
});