// FE/src/components/home/HeroSection.jsx
// REVISI TAHAP 1: Stats (Proyek, Klien, Tahun, Support) sekarang DINAMIS
// dari useSettings() — identik dengan cara AboutPage.jsx membaca settings.

import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { COMPANY } from '@/utils/constants';
import { waUrl } from '@/utils/formatters';
import { useSettings } from '@/contexts/SettingsContext'; // ← TAMBAHAN
import styles from './HeroSection.module.css';

const highlights = [
  'Principal Distributor Masagi Resmi',
  'Tim Teknisi Berpengalaman',
  'Respon Cepat 24 Jam',
];

export default function HeroSection() {
  // Sama persis dengan pola di AboutPage.jsx
  const { settings } = useSettings();

  // Mapping field settings ke label tampilan — fallback ke nilai statis
  // jika settings belum dimuat agar tidak terjadi layout shift
  const stats = [
    { num: settings?.stats_projects || '500+', label: 'Proyek Selesai' },
    { num: settings?.stats_years    || '15+',  label: 'Tahun Pengalaman' },
    { num: settings?.stats_clients  || '200+', label: 'Klien Aktif' },
    { num: settings?.stats_support  || '24/7', label: 'Layanan Darurat' },
  ];

  return (
    <section className={styles.hero}>
      {/* Background geometric pattern */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.glow} />
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.text}>
          <span className={styles.overline}>Principal Distributor Masagi</span>
          <h1 className={styles.heading}>
            Solusi Terpadu<br />
            <em>VAC, Mekanikal</em><br />
            &amp; Elektrikal
          </h1>
          <p className={styles.sub}>
            PT. Mitra Niaga Indonesia menyediakan produk AC, Genset, Lampu LED,
            dan layanan maintenance profesional untuk gedung komersial &amp; industri.
          </p>

          <ul className={styles.bullets}>
            {highlights.map((h) => (
              <li key={h}>
                <CheckCircle size={16} />
                {h}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link to="/kontak" className="btn btn-primary btn-lg">
              Request Penawaran
              <ArrowRight size={18} />
            </Link>
            <a
              href={waUrl(COMPANY.whatsapp, 'Halo, saya ingin konsultasi gratis.')}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-light btn-lg"
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>

        {/* Stats Card — DINAMIS dari settings */}
        <div className={styles.statsWrap}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider */}
      <div className={styles.wave} aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,60 C360,120 1080,0 1440,60 L1440,100 L0,100 Z" fill="#F5F6F8" />
        </svg>
      </div>
    </section>
  );
}