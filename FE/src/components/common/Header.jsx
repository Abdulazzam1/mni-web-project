import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS } from '@/utils/constants'; // Hanya import NAV_LINKS
import { useSettings } from '@/contexts/SettingsContext'; // Import untuk nomor otomatis
import logoMNI from '../../assets/cropped-mni-1-1.png';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  
  // Mengambil data pengaturan dinamis
  const { settings } = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <img src={logoMNI} alt="Logo PT Mitra Niaga Indonesia" className={styles.logoImage} />
        </Link>

        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.cta}>
          {/* NOMOR TELP OTOMATIS DARI DATABASE - DIARAHKAN KE WHATSAPP */}
          <a 
            href={`https://wa.me/${settings?.contact_sales}`} 
            target="_blank" 
            rel="noreferrer"
            className={styles.phoneLink}
          >
            <Phone size={16} />
            <span>{settings?.contact_sales}</span>
          </a>
          <Link to="/kontak" className="btn btn-primary">
            Request Penawaran
          </Link>
        </div>

        <button
          className={styles.toggle}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          
          {/* Tambahan Link WA di Mobile Menu jika diperlukan */}
          <a 
            href={`https://wa.me/${settings?.contact_sales}`} 
            target="_blank" 
            rel="noreferrer" 
            className={styles.mobileContactLink}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem', color: 'inherit' }}
          >
            <Phone size={18} />
            <span>{settings?.contact_sales}</span>
          </a>

          <Link to="/kontak" className={`btn btn-primary ${styles.mobileBtn}`}>
            Request Penawaran
          </Link>
        </div>
      )}
    </header>
  );
}