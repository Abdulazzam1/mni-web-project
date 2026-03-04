import SEOMeta from '@/components/common/SEOMeta';
import { useSettings } from '@/contexts/SettingsContext';
import { imgUrl } from '@/utils/formatters';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  const { settings, loadingSettings } = useSettings();

  if (loadingSettings) return <div className="spinner" style={{ marginTop: '10rem' }} />;
  if (!settings) return null;

  const companyValues = settings.company_values || [];

  return (
    <>
      <SEOMeta
        title="Tentang Kami"
        description="Profil PT. Mitra Niaga Indonesia - Principal Distributor Masagi, spesialis VAC, Mekanikal dan Elektrikal."
      />

      <div className={styles.hero}>
        <div className="container">
          <span className={styles.overline}>Profil Perusahaan</span>
          <h1>Tentang PT. Mitra Niaga Indonesia</h1>
          <p>Mitra terpercaya untuk solusi VAC, Mekanikal, Elektrikal dan Plumbing sejak lebih dari satu dekade.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.imgSide}>
              <img 
                src={imgUrl(settings.about_image)} 
                alt="Tentang MNI" 
                onError={(e) => { e.target.src = 'https://placehold.co/600x450/0A1628/E8A020?text=PT.+MNI'; }} 
              />
            </div>
            <div className={styles.textSide}>
              <span className="overline" style={{ color: 'var(--clr-amber)' }}>Siapa Kami</span>
              
              <h2>{settings.about_title}</h2>
              
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

              {/* FIX STRATEGI: Tombol Download langsung buka URL Google Drive */}
              {settings.compro_file && (
                <div style={{ marginTop: '2.5rem' }}>
                  <a 
                    href={settings.compro_file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn" 
                    style={{ 
                      backgroundColor: 'var(--clr-amber)', 
                      color: 'var(--clr-navy)', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      fontWeight: 'bold',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download Company Profile
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={`section section--off`}>
        <div className="container">
          <div className={styles.vmGrid}>
            <div className={styles.vmCard}>
              <div className={styles.vmIcon}>🎯</div>
              <h3>Visi</h3>
              <p>{settings.vision}</p>
            </div>
            <div className={styles.vmCard}>
              <div className={styles.vmIcon}>🚀</div>
              <h3>Misi</h3>
              <ul>
                {settings.mission?.split('||').map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Nilai Kami</span>
            <h2>Prinsip yang Memandu Kami</h2>
          </div>
          <div className="grid-4">
            {companyValues.map((v, idx) => (
              <div key={idx} className={styles.valueCard}>
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