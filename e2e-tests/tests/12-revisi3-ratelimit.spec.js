const { test, expect } = require('@playwright/test');

test.describe('Revisi 3: Uji Coba Batas Rate Limit Server', () => {
  
  test('Aplikasi harus bisa menangani 150 request beruntun tanpa terblokir (Error 429)', async ({ request }) => {
    // Kita simulasikan perilaku CMS yang melakukan banyak request dalam waktu singkat
    const totalRequestsToSimulate = 150; 
    let successfulRequests = 0;
    let blockedRequests = 0;

    console.log(`Memulai pengiriman ${totalRequestsToSimulate} request ke server...`);

    // Lakukan request beruntun ke endpoint yang ringan
    for (let i = 0; i < totalRequestsToSimulate; i++) {
      const response = await request.get('http://localhost:5001/api/health'); // Sesuaikan port dengan backend lokal Anda
      
      if (response.status() === 200) {
        successfulRequests++;
      } else if (response.status() === 429) {
        blockedRequests++;
      }
    }

    console.log(`Berhasil: ${successfulRequests}, Diblokir (429): ${blockedRequests}`);

    // EKSPEKTASI: Tidak boleh ada request yang diblokir (429) karena batas sudah kita naikkan jadi 1000
    expect(blockedRequests).toBe(0);
    expect(successfulRequests).toBe(totalRequestsToSimulate);
  });

});