import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS, COMPANY } from '@/utils/constants';
import logoMNI from '../../assets/cropped-mni-1-1.png'; // Import logo gambar di sini
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo Menggunakan Gambar */}
        <Link to="/" className={styles.logo}>
          <img src={logoMNI} alt="Logo PT Mitra Niaga Indonesia" className={styles.logoImage} />
        </Link>

        {/* Desktop Nav */}
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

        {/* CTA */}
        <div className={styles.cta}>
          <a href={`tel:${COMPANY.phone.sales}`} className={styles.phoneLink}>
            <Phone size={14} />
            {COMPANY.phone.sales}
          </a>
          <Link to="/kontak" className="btn btn-primary">
            Request Penawaran
          </Link>
        </div>

        {/* Mobile Toggle */}
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
          <Link to="/kontak" className={`btn btn-primary ${styles.mobileBtn}`}>
            Request Penawaran
          </Link>
        </div>
      )}
    </header>
  );
}