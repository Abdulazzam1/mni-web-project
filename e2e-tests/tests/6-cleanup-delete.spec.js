const { test, expect } = require('@playwright/test');

test('Sapu Bersih Semua Data Dummy [TEST]', async ({ page }) => {
  // 1. LOGIN HANYA SEKALI (Aman dari blokir / Rate Limit)
  await page.goto('http://localhost:5174/#/login');
  await page.locator('input[type="email"]').fill('admin@mitraniagaindonesia.co.id');
  await page.locator('input[type="password"]').fill('Admin@MNI2024');
  await page.locator('input[type="password"]').press('Enter');
  
  // Tunggu sampai benar-benar masuk dashboard
  await expect(page).toHaveURL(/.*dashboard.*/i, { timeout: 15000 });
  console.log('✅ Login berhasil, memulai proses sapu bersih...');

  // Daftar rute modul yang akan dibersihkan
  const modules = [
    { name: 'Produk', url: 'http://localhost:5174/#/produk' },
    { name: 'Berita', url: 'http://localhost:5174/#/berita' },
    { name: 'Portfolio', url: 'http://localhost:5174/#/portfolio' }
  ];

  for (const module of modules) {
    console.log(`\n🧹 Membersihkan modul: ${module.name}...`);
    await page.goto(module.url);
    
    // Beri waktu 3 detik agar API selesai memasukkan data ke tabel
    await page.waitForTimeout(3000); 

    while (true) {
      // Cari baris yang mengandung teks [TEST]
      const row = page.locator('tr', { hasText: '[TEST]' }).first();
      
      // Pengecekan aman: Jika tidak ada baris [TEST], keluar dari loop & lanjut ke modul berikutnya
      if (await row.count() === 0) {
        break;
      }

      // Ambil teks judul untuk keperluan log (agar kita tahu apa yang sedang dihapus)
      const title = await row.locator('td').first().innerText().catch(() => 'Data Dummy');
      console.log(`   🗑️ Menghapus: ${title}`);

      // Klik tombol ikon sampah (paling kanan di baris tabel tersebut)
      const deleteBtn = row.locator('button').last(); 
      await deleteBtn.click();

      // Targetkan tombol konfirmasi merah "Ya, Lanjutkan" di dalam modal
      const confirmBtn = page.locator('button').filter({ hasText: /ya, lanjutkan|ya|lanjutkan|hapus|delete|confirm/i }).last();
      
      try {
        // Tunggu modal muncul, lalu klik
        await expect(confirmBtn).toBeVisible({ timeout: 5000 });
        await confirmBtn.click();
      } catch (error) {
        console.log('   ⚠️ Modal konfirmasi tidak merespons. Me-refresh halaman...');
        await page.reload();
        await page.waitForTimeout(3000);
        continue; // Ulangi pencarian dari awal
      }

      // PERBAIKAN FINAL: Menangani tabel yang bandel / delay sinkronisasi
      try {
        // Tunggu maksimal 5 detik agar baris tersebut lenyap dari layar
        await expect(row).not.toBeVisible({ timeout: 5000 });
        // Jeda 500ms agar tidak membombardir server (mencegah error 429 Terlalu Banyak Request)
        await page.waitForTimeout(500); 
      } catch (e) {
        console.log(`   ⏳ Data masih terlihat di layar karena delay API. Menyegarkan tabel...`);
        // Jika data masih ada (hanya nyangkut di UI), paksa muat ulang halaman
        await page.reload();
        await page.waitForTimeout(3000); 
      }
    }
    console.log(`✨ Modul ${module.name} sudah bersih mengkilap.`);
  }
  
  console.log('\n🎉 PEMBERSIHAN SELESAI: Database MNI kembali bersih 100%!');
});