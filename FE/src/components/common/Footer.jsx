import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { COMPANY, NAV_LINKS } from '@/utils/constants';
import logoMNI from '../../assets/cropped-mni-1-1.png'; // Import gambar logo
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand */}
        <div className={styles.brand}>
          {/* Logo teks diganti dengan logo gambar */}
          <Link to="/" className={styles.logo}>
            <img src={logoMNI} alt="Logo PT Mitra Niaga Indonesia" className={styles.logoImage} />
          </Link>
          <p className={styles.tagline}>
            Principal Distributor Masagi & General Supplier spesialis VAC,
            Mekanikal, Elektrikal dan Plumbing.
          </p>
          <div className={styles.socials}>
            <a href={COMPANY.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href={COMPANY.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={COMPANY.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
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
          <a href={`tel:${COMPANY.phone.sales}`} className={styles.contact}>
            <Phone size={15} />
            <div>
              <span className={styles.contactLabel}>Sales</span>
              <span>{COMPANY.phone.sales}</span>
            </div>
          </a>
          <a href={`tel:${COMPANY.phone.service}`} className={styles.contact}>
            <Phone size={15} />
            <div>
              <span className={styles.contactLabel}>Service</span>
              <span>{COMPANY.phone.service}</span>
            </div>
          </a>
          <a href={`mailto:${COMPANY.email}`} className={styles.contact}>
            <Mail size={15} />
            <span>{COMPANY.email}</span>
          </a>
          <div className={styles.contact}>
            <MapPin size={15} />
            <span>{COMPANY.address}</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>© {year} {COMPANY.name}. Hak cipta dilindungi undang-undang.</p>
        </div>
      </div>
    </footer>
  );
}