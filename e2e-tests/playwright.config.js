const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000, // Maksimal 1 menit per tes
  expect: { timeout: 10000 },
  fullyParallel: false, // Jalankan berurutan agar alur bisnis jelas
  reporter: 'html', // Menghasilkan laporan visual yang cantik
  globalTeardown: require.resolve('./global-teardown.js'), // Menjalankan skrip pembersih di akhir
  use: {
    browserName: 'chromium',
    headless: false, // Set 'true' jika tidak ingin melihat browsernya terbuka
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure', // Rekam video jika ada tes yang gagal
  },
});