// FE/src/components/common/Footer.jsx
// REVISI TAHAP 3: Layanan di footer dinamis via useFetch(getServices), maks 5 item
// REVISI TAHAP 5: Kontak dinamis dari settings.contact_persons [{name,role,wa}]

import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { NAV_LINKS } from '@/utils/constants';
import { useSettings } from '@/contexts/SettingsContext';
import useFetch from '@/hooks/useFetch';
import { getServices } from '@/services/serviceService';   // TAHAP 3
import logoMNI from '../../assets/cropped-mni-1-1.png';
import isoLogo1 from '../../assets/Cuplikan_layar_2026-04-28_161608-removebg-preview.png';
import isoLogo2 from '../../assets/Cuplikan_layar_2026-04-28_161707-removebg-preview.png';
import isoLogo3 from '../../assets/Cuplikan_layar_2026-04-28_161721-removebg-preview.png';
import styles from './Footer.module.css';

const validUrl = (url) => {
  if (!url) return '#';
  return url.startsWith('http') ? url : `https://${url}`;
};

export default function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSettings();

  // ─── TAHAP 3: layanan dinamis, dibatasi 5 item ───────────────
  const { data: services } = useFetch(getServices);
  const topServices = (services || []).slice(0, 5);

  // ─── TAHAP 5: contact_persons dari settings (JSONB) ──────────
  // Format: [{name: string, role: string, wa: string}]
  const contactPersons = (() => {
    const raw = settings?.contact_persons;
    if (!raw) return [];
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  })();

  // Fallback: jika contact_persons belum diisi, tampilkan field lama
  const showLegacyContacts = contactPersons.length === 0;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>

        {/* ── Brand ── */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <img src={logoMNI} alt="Logo PT Mitra Niaga Indonesia" className={styles.logoImage} />
          </Link>
          <p className={styles.tagline}>
            Principal Distributor Masagi &amp; General Supplier spesialis VAC,
            Mekanikal, Elektrikal dan Plumbing.
          </p>

          {/* ISO logos */}
          <div className={styles.isoSection}>
            <img src={isoLogo1} alt="Sertifikasi" className={styles.isoImage} />
            <img src={isoLogo2} alt="Sertifikasi" className={styles.isoImage} />
            <img src={isoLogo3} alt="Sertifikasi" className={styles.isoImage} />
          </div>

          <div className={styles.socials}>
            <a href={validUrl(settings?.social_instagram)} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href={validUrl(settings?.social_linkedin)} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={validUrl(settings?.social_facebook)} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Tautan</h4>
          <div className={styles.links}>
            {NAV_LINKS.map((link) => (
              <Link key={link.path} to={link.path} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── TAHAP 3: Layanan Dinamis, maks 5 ── */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Layanan</h4>
          <div className={styles.links}>
            {topServices.length > 0 ? (
              topServices.map((svc) => (
                <Link key={svc.id} to="/layanan" className={styles.link}>
                  {svc.name}
                </Link>
              ))
            ) : (
              // Fallback statis saat API belum siap
              <>
                <Link to="/layanan" className={styles.link}>Pengadaan Unit AC</Link>
                <Link to="/layanan" className={styles.link}>Instalasi AC</Link>
                <Link to="/layanan" className={styles.link}>Maintenance Genset</Link>
              </>
            )}
          </div>
        </div>

        {/* ── TAHAP 5: Kontak — dinamis dari contact_persons ── */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Kontak</h4>

          {/* Contact Persons dinamis */}
          {!showLegacyContacts && contactPersons.map((person, idx) => (
            <a
              key={idx}
              href={`https://wa.me/${person.wa}`}
              className={styles.contact}
              target="_blank"
              rel="noreferrer"
            >
              <Phone size={15} />
              <div>
                <span className={styles.contactLabel}>{person.role}</span>
                <span>{person.name}</span>
                <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.7 }}>{person.wa}</span>
              </div>
            </a>
          ))}

          {/* Fallback ke field lama jika contact_persons kosong */}
          {showLegacyContacts && (
            <>
              {settings?.contact_sales && (
                <a href={`https://wa.me/${settings.contact_sales}`} className={styles.contact} target="_blank" rel="noreferrer">
                  <Phone size={15} />
                  <div>
                    <span className={styles.contactLabel}>Sales</span>
                    <span>{settings.contact_sales}</span>
                  </div>
                </a>
              )}
              {settings?.contact_service && (
                <a href={`https://wa.me/${settings.contact_service}`} className={styles.contact} target="_blank" rel="noreferrer">
                  <Phone size={15} />
                  <div>
                    <span className={styles.contactLabel}>Service</span>
                    <span>{settings.contact_service}</span>
                  </div>
                </a>
              )}
            </>
          )}

          <a href={`mailto:${settings?.contact_email}`} className={styles.contact}>
            <Mail size={15} />
            <span>{settings?.contact_email}</span>
          </a>

          <div className={styles.contact}>
            <MapPin size={15} />
            <span>{settings?.contact_address}</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>© {year} PT. Mitra Niaga Indonesia. Hak cipta dilindungi undang-undang.</p>
        </div>
      </div>
    </footer>
  );
}