/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ─── MNI Brand Color System ───────────────────────────
      colors: {
        // Deep Navy — warna dominan sidebar & header
        navy: {
          50:  '#E8EDF5',
          100: '#C5D0E5',
          200: '#9EAFD4',
          300: '#778EC3',
          400: '#5A75B8',
          500: '#3C5CAB',
          600: '#2D4A8F',
          700: '#1E3570',
          800: '#0F2040',   // ← Navy utama
          900: '#0A1628',   // ← Navy terdalam (sidebar)
          950: '#060E1B',
        },
        // Obsidian Black — teks, elemen gelap
        obsidian: {
          50:  '#F2F2F3',
          100: '#D9DADC',
          200: '#B8BABE',
          300: '#96999F',
          400: '#747880',
          500: '#535861',
          600: '#3C4048',
          700: '#272A30',
          800: '#1A1D22',   // ← Hitam obsidian
          900: '#0F1115',
        },
        // Golden Amber — aksen CTA, badge, highlight
        amber: {
          50:  '#FFF8E8',
          100: '#FEEEC4',
          200: '#FDD88A',
          300: '#FBBD42',
          400: '#F5A800',
          500: '#E8A020',   // ← Amber utama
          600: '#C07010',
          700: '#9A5508',
          800: '#7A4006',
          900: '#5C2E04',
        },
        // Crimson Red — status bahaya, tombol hapus
        crimson: {
          50:  '#FFF0F0',
          100: '#FFDADA',
          200: '#FFA8A8',
          300: '#FF6B6B',
          400: '#EE3B3B',
          500: '#D32121',   // ← Merah utama
          600: '#B01818',
          700: '#8A1010',
          800: '#640909',
          900: '#420404',
        },
        // Semantic aliases (gunakan ini di komponen)
        surface: {
          DEFAULT: '#F8F9FB',   // bg utama halaman
          card:    '#FFFFFF',   // bg card
          border:  '#E2E6ED',   // border default
          hover:   '#F1F4F8',   // hover state
        },
      },

      // ─── Typography ──────────────────────────────────────
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },

      // ─── Spacing & Sizing ────────────────────────────────
      spacing: {
        sidebar: '260px',
        topbar:  '64px',
      },

      // ─── Shadows ─────────────────────────────────────────
      boxShadow: {
        card:   '0 1px 4px rgba(10,22,40,0.07), 0 4px 16px rgba(10,22,40,0.05)',
        'card-hover': '0 4px 12px rgba(10,22,40,0.12), 0 12px 32px rgba(10,22,40,0.1)',
        topbar: '0 1px 0 #E2E6ED',
        sidebar: '2px 0 16px rgba(10,22,40,0.12)',
        amber:  '0 4px 20px rgba(232,160,32,0.3)',
      },

      // ─── Border Radius ───────────────────────────────────
      borderRadius: {
        DEFAULT: '8px',
        md:  '10px',
        lg:  '14px',
        xl:  '18px',
        '2xl': '24px',
      },

      // ─── Animation ───────────────────────────────────────
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out both',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'pulse2':   'pulse2 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
