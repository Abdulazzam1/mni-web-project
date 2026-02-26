import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { NAV_LINKS } from '@/utils/constants'; 
import { useSettings } from '@/contexts/SettingsContext'; 
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
            <a href={settings?.social_instagram || '#'} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href={settings?.social_linkedin || '#'} target="_blank" rel="noreferrer" aria-label="Linkedin">
              <Linkedin size={18} />
            </a>
            <a href={settings?.social_facebook || '#'} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
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

        {/* Layanan Populer */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Layanan</h4>
          <Link to="/layanan" className={styles.link}>Pengadaan Unit AC</Link>
          <Link to="/layanan" className={styles.link}>Instalasi AC</Link>
          <Link to="/layanan" className={styles.link}>Maintenance Genset</Link>
        </div>

        {/* Kontak - Diperbarui ke WhatsApp */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Kontak</h4>
          
          {/* Link WhatsApp Sales */}
          <a 
            href={`https://wa.me/${settings?.contact_sales}`} 
            className={styles.contact} 
            target="_blank" 
            rel="noreferrer"
          >
            <Phone size={15} />
            <div>
              <span className={styles.contactLabel}>Sales</span>
              <span>{settings?.contact_sales}</span>
            </div>
          </a>

          {/* Link WhatsApp Service */}
          <a 
            href={`https://wa.me/${settings?.contact_service}`} 
            className={styles.contact} 
            target="_blank" 
            rel="noreferrer"
          >
            <Phone size={15} />
            <div>
              <span className={styles.contactLabel}>Service</span>
              <span>{settings?.contact_service}</span>
            </div>
          </a>

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