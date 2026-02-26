import SEOMeta from '@/components/common/SEOMeta';
import { useSettings } from '@/contexts/SettingsContext'; // <-- IMPORT CONTEXT
import styles from './AboutPage.module.css';

const values = [
  { title: 'Kualitas', desc: 'Kami hanya menyediakan produk berstandar tinggi dengan garansi resmi.' },
  { title: 'Integritas', desc: 'Jujur dan transparan dalam setiap aspek layanan dan penawaran kami.' },
  { title: 'Profesional', desc: 'Tim teknisi tersertifikasi dengan pengalaman di bidang VAC dan mekanikal.' },
  { title: 'Responsif', desc: 'Siap membantu 24/7 untuk kebutuhan darurat klien kami.' },
];

export default function AboutPage() {
  const { settings, loadingSettings } = useSettings();

  // Tampilkan loading jika data dari database belum turun
  if (loadingSettings) return <div className="spinner" style={{ marginTop: '10rem' }} />;
  // Jika gagal ambil data, tampilkan fallback kosong agar tidak crash
  if (!settings) return null; 

  return (
    <>
      <SEOMeta
        title="Tentang Kami"
        description="Profil PT. Mitra Niaga Indonesia - Principal Distributor Masagi, spesialis VAC, Mekanikal dan Elektrikal."
      />

      {/* Page Hero */}
      <div className={styles.hero}>
        <div className="container">
          <span className={styles.overline}>Profil Perusahaan</span>
          <h1>Tentang PT. Mitra Niaga Indonesia</h1>
          <p>Mitra terpercaya untuk solusi VAC, Mekanikal, Elektrikal dan Plumbing sejak lebih dari satu dekade.</p>
        </div>
      </div>

      {/* About Content */}
      <section className="section">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.imgSide}>
              <img src="/about-photo.jpg" alt="Tentang MNI" onError={(e) => { e.target.src = 'https://placehold.co/600x450/0A1628/E8A020?text=PT.+MNI'; }} />
            </div>
            <div className={styles.textSide}>
              <span className="overline" style={{ color: 'var(--clr-amber)' }}>Siapa Kami</span>
              
              {/* DINAMIS: Judul About */}
              <h2>{settings.about_title}</h2>
              
              {/* DINAMIS: Deskripsi dipecah berdasarkan simbol || yang kita buat di database */}
              {settings.about_description?.split('||').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}

              <div className={styles.statsRow}>
                {[
                  { num: settings.stats_projects, label: 'Proyek' },
                  { num: settings.stats_clients, label: 'Klien' },
                  { num: settings.stats_years, label: 'Tahun' },
                  { num: settings.stats_support, label: 'Support' },
                ].map((s) => (
                  <div key={s.label} className={styles.stat}>
                    <strong>{s.num}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className={`section section--off`}>
        <div className="container">
          <div className={styles.vmGrid}>
            <div className={styles.vmCard}>
              <div className={styles.vmIcon}>🎯</div>
              <h3>Visi</h3>
              {/* DINAMIS: Visi */}
              <p>{settings.vision}</p>
            </div>
            <div className={styles.vmCard}>
              <div className={styles.vmIcon}>🚀</div>
              <h3>Misi</h3>
              <ul>
                {/* DINAMIS: Misi dipecah menjadi list <li> */}
                {settings.mission?.split('||').map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Nilai Kami</span>
            <h2>Prinsip yang Memandu Kami</h2>
          </div>
          <div className="grid-4">
            {values.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}