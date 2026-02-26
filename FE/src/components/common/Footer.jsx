import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { NAV_LINKS } from '@/utils/constants'; // COMPANY dihapus karena kita pakai setting dinamis
import { useSettings } from '@/contexts/SettingsContext'; // <-- IMPORT CONTEXT
import logoMNI from '../../assets/cropped-mni-1-1.png'; 
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <img src={logoMNI} alt="Logo PT Mitra Niaga Indonesia" className={styles.logoImage} />
          </Link>
          <p className={styles.tagline}>
            Principal Distributor Masagi & General Supplier spesialis VAC,
            Mekanikal, Elektrikal dan Plumbing.
          </p>
          <div className={styles.socials}>
            {/* DINAMIS: Link Sosial Media */}
            <a href={settings?.social_instagram || '#'} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href={settings?.social_linkedin || '#'} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={settings?.social_facebook || '#'} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Navigasi</h4>
          {NAV_LINKS.map((l) => (
            <Link key={l.path} to={l.path} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Layanan */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Layanan</h4>
          <Link to="/layanan" className={styles.link}>Preventive Maintenance</Link>
          <Link to="/layanan" className={styles.link}>Perbaikan AC</Link>
          <Link to="/layanan" className={styles.link}>Instalasi AC</Link>
          <Link to="/layanan" className={styles.link}>Maintenance Genset</Link>
        </div>

        {/* Kontak */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Kontak</h4>
          <a href={`tel:${settings?.contact_sales}`} className={styles.contact}>
            <Phone size={15} />
            <div>
              <span className={styles.contactLabel}>Sales</span>
              {/* DINAMIS: Nomor Sales */}
              <span>{settings?.contact_sales}</span>
            </div>
          </a>
          <a href={`tel:${settings?.contact_service}`} className={styles.contact}>
            <Phone size={15} />
            <div>
              <span className={styles.contactLabel}>Service</span>
              {/* DINAMIS: Nomor Service */}
              <span>{settings?.contact_service}</span>
            </div>
          </a>
          <a href={`mailto:${settings?.contact_email}`} className={styles.contact}>
            <Mail size={15} />
            {/* DINAMIS: Email */}
            <span>{settings?.contact_email}</span>
          </a>
          <div className={styles.contact}>
            <MapPin size={15} />
            {/* DINAMIS: Alamat */}
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