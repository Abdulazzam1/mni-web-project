import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import SEOMeta from '@/components/common/SEOMeta';
import RFQForm from '@/components/contact/RFQForm';
import { submitContact } from '@/services/contactService';
import { COMPANY } from '@/utils/constants';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setStatus(null);
    try {
      await submitContact(data);
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOMeta title="Kontak" description="Hubungi PT. Mitra Niaga Indonesia untuk informasi produk, layanan, dan penawaran." />

      <div className={styles.hero}>
        <div className="container">
          <span className={styles.overline}>Kontak</span>
          <h1>Hubungi Kami</h1>
          <p>Tim kami siap membantu kebutuhan Anda dari Senin–Sabtu, 08.00–17.00 WIB.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Left - Info */}
            <div className={styles.infoCol}>
              <h2>Informasi Kontak</h2>

              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}><Phone size={20} /></div>
                  <div>
                    <span className={styles.label}>Sales</span>
                    <a href={`tel:${COMPANY.phone.sales}`}>{COMPANY.phone.sales}</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}><Phone size={20} /></div>
                  <div>
                    <span className={styles.label}>Service / Maintenance</span>
                    <a href={`tel:${COMPANY.phone.service}`}>{COMPANY.phone.service}</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}><Mail size={20} /></div>
                  <div>
                    <span className={styles.label}>Email</span>
                    <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}><MapPin size={20} /></div>
                  <div>
                    <span className={styles.label}>Alamat</span>
                    <span>{COMPANY.address}</span>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.iconBox}><Clock size={20} /></div>
                  <div>
                    <span className={styles.label}>Jam Operasional</span>
                    <span>Senin – Sabtu: 08.00 – 17.00 WIB</span>
                  </div>
                </div>
              </div>

              {/* Simple Contact Form */}
              <div className={styles.contactForm}>
                <h3>Kirim Pesan</h3>
                {status === 'success' && (
                  <div className={styles.successAlert}>✅ Pesan berhasil dikirim!</div>
                )}
                {status === 'error' && (
                  <div className={styles.errorAlert}>❌ Gagal mengirim, coba lagi.</div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="form-group">
                    <label>Nama *</label>
                    <input className={`form-control ${errors.name ? 'error' : ''}`}
                      placeholder="Nama Anda"
                      {...register('name', { required: true })} />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" className={`form-control ${errors.email ? 'error' : ''}`}
                      placeholder="email@contoh.com"
                      {...register('email', { required: true })} />
                  </div>
                  <div className="form-group">
                    <label>Telepon</label>
                    <input className="form-control" placeholder="08xx-xxxx-xxxx"
                      {...register('phone')} />
                  </div>
                  <div className="form-group">
                    <label>Subjek</label>
                    <input className="form-control" placeholder="Subjek pesan"
                      {...register('subject')} />
                  </div>
                  <div className="form-group">
                    <label>Pesan *</label>
                    <textarea className={`form-control ${errors.message ? 'error' : ''}`}
                      rows={4} placeholder="Tulis pesan Anda..."
                      {...register('message', { required: true })} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right - RFQ Form & Map */}
            <div className={styles.rfqCol}>
              <RFQForm />
              <div className={styles.mapWrap}>
                <iframe
                  src={import.meta.env.VITE_GOOGLE_MAPS_EMBED || 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d126920.33063316753!2d106.7793599!3d-6.2141675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1720000000000!5m2!1sid!2sid'}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Lokasi MNI"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}