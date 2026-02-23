import SEOMeta from '@/components/common/SEOMeta';
import styles from './AboutPage.module.css';

const values = [
  { title: 'Kualitas', desc: 'Kami hanya menyediakan produk berstandar tinggi dengan garansi resmi.' },
  { title: 'Integritas', desc: 'Jujur dan transparan dalam setiap aspek layanan dan penawaran kami.' },
  { title: 'Profesional', desc: 'Tim teknisi tersertifikasi dengan pengalaman di bidang VAC dan mekanikal.' },
  { title: 'Responsif', desc: 'Siap membantu 24/7 untuk kebutuhan darurat klien kami.' },
];

export default function AboutPage() {
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
              <h2>Principal Distributor Masagi & General Supplier</h2>
              <p>
                PT. Mitra Niaga Indonesia adalah perusahaan yang bergerak di bidang distribusi
                produk dan layanan teknis untuk kebutuhan gedung, khususnya pada sektor
                Mekanikal dan Elektrikal. Kami adalah Principal Distributor resmi Masagi
                sekaligus General Supplier yang menyediakan layanan terpadu.
              </p>
              <p>
                Produk yang kami sediakan meliputi sistem Air Conditioning (VAC), Lampu LED,
                dan Genset, didukung oleh layanan Preventive Maintenance & Perbaikan yang
                ditangani oleh teknisi berpengalaman dan bersertifikat.
              </p>

              <div className={styles.statsRow}>
                {[
                  { num: '500+', label: 'Proyek' },
                  { num: '200+', label: 'Klien' },
                  { num: '15+', label: 'Tahun' },
                  { num: '24/7', label: 'Support' },
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
              <p>
                Menjadi perusahaan distribusi dan layanan teknis VAC, Mekanikal, dan Elektrikal
                terpercaya dan terdepan di Indonesia, dengan mengutamakan kualitas produk
                dan kepuasan pelanggan.
              </p>
            </div>
            <div className={styles.vmCard}>
              <div className={styles.vmIcon}>🚀</div>
              <h3>Misi</h3>
              <ul>
                <li>Menyediakan produk berkualitas tinggi dengan harga kompetitif</li>
                <li>Memberikan layanan purna jual terbaik dan cepat</li>
                <li>Membangun kemitraan jangka panjang berbasis kepercayaan</li>
                <li>Terus berinovasi dalam solusi teknis untuk pelanggan</li>
                <li>Mengembangkan SDM yang kompeten dan berintegritas</li>
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