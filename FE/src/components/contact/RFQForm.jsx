import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitRFQ } from '@/services/contactService';
import { PRODUCT_CATEGORIES } from '@/utils/constants';
import styles from './RFQForm.module.css';

export default function RFQForm() {
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setStatus(null);
    try {
      await submitRFQ(data);
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>Request Penawaran (RFQ)</h3>
      <p className={styles.sub}>Isi form berikut, tim sales kami akan menghubungi Anda dalam 1×24 jam.</p>

      {status === 'success' && (
        <div className={styles.alert + ' ' + styles.success}>
          ✅ Permintaan berhasil dikirim! Kami akan segera menghubungi Anda.
        </div>
      )}
      {status === 'error' && (
        <div className={styles.alert + ' ' + styles.errAlert}>
          ❌ Gagal mengirim. Silakan coba lagi atau hubungi kami via WhatsApp.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <div className={styles.row}>
          <div className="form-group">
            <label>Nama Perusahaan *</label>
            <input
              className={`form-control ${errors.company_name ? 'error' : ''}`}
              placeholder="PT. Nama Perusahaan"
              {...register('company_name', { required: 'Wajib diisi' })}
            />
            {errors.company_name && <span className="error-msg">{errors.company_name.message}</span>}
          </div>
          <div className="form-group">
            <label>Nama Kontak *</label>
            <input
              className={`form-control ${errors.contact_name ? 'error' : ''}`}
              placeholder="Nama Anda"
              {...register('contact_name', { required: 'Wajib diisi' })}
            />
            {errors.contact_name && <span className="error-msg">{errors.contact_name.message}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="email@perusahaan.com"
              {...register('email', {
                required: 'Wajib diisi',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' },
              })}
            />
            {errors.email && <span className="error-msg">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label>No. Telepon</label>
            <input
              className="form-control"
              placeholder="08xx-xxxx-xxxx"
              {...register('phone')}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Produk / Layanan yang Diminati *</label>
          <select
            className={`form-control ${errors.product_interest ? 'error' : ''}`}
            {...register('product_interest', { required: 'Pilih produk/layanan' })}
          >
            <option value="">-- Pilih --</option>
            {PRODUCT_CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
              <option key={c.value} value={c.label}>{c.label}</option>
            ))}
            <option value="Preventive Maintenance">Preventive Maintenance</option>
            <option value="Perbaikan / Servis">Perbaikan / Servis</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          {errors.product_interest && <span className="error-msg">{errors.product_interest.message}</span>}
        </div>

        <div className="form-group">
          <label>Keterangan Tambahan</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Tuliskan kebutuhan atau pertanyaan Anda..."
            {...register('message')}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim Permintaan'}
        </button>
      </form>
    </div>
  );
}