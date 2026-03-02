import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 👇 PLUGIN KUSTOM: Menghapus localhost:5000 & 5001 saat Build (Hanya aktif di VPS) 👇
    {
      name: 'auto-replace-localhost-fe',
      apply: 'build',
      transform(code, id) {
        if (id.endsWith('.jsx') || id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.tsx')) {
          // Menghapus port 5000 maupun 5001 jika ada yang ter-hardcode di FE
          return code
            .replace(/http:\/\/localhost:5000/g, '')
            .replace(/http:\/\/localhost:5001/g, '');
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Saat dev, request ke /api akan diforward ke BE
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'swiper', 'lucide-react'],
        },
      },
    },
  },
});