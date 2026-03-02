import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // 👇 PLUGIN KUSTOM: Menghapus localhost:5001 saat Build (Hanya aktif di VPS) 👇
    {
      name: 'auto-replace-localhost-cms',
      apply: 'build', 
      transform(code, id) {
        if (id.endsWith('.jsx') || id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.tsx')) {
          return code.replace(/http:\/\/localhost:5001/g, '');
        }
      }
    }
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // <-- SUDAH DIKOREKSI KE 5001
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5001', // <-- SUDAH DIKOREKSI KE 5001
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query:  ['@tanstack/react-query'],
          charts: ['recharts'],
        },
      },
    },
  },
});