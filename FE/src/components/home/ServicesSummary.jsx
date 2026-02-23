import { Link } from 'react-router-dom';
import { Wind, Zap, Wrench, Settings, ArrowRight } from 'lucide-react';
import styles from './ServicesSummary.module.css';

const services = [
  {
    icon: Wind,
    title: 'Air Conditioning',
    desc: 'Supply, instalasi, dan perawatan sistem AC untuk berbagai skala gedung komersial dan industri.',
  },
  {
    icon: Zap,
    title: 'Genset & Power',
    desc: 'Penyediaan dan maintenance genset untuk backup daya, dari skala kecil hingga industrial.',
  },
  {
    icon: Settings,
    title: 'Preventive Maintenance',
    desc: 'Program maintenance terjadwal dengan teknisi berpengalaman untuk menjaga performa optimal.',
  },
  {
    icon: Wrench,
    title: 'Perbaikan & Servis',
    desc: 'Respon cepat untuk perbaikan darurat dengan garansi pekerjaan dan spare part original.',
  },
];

export default function ServicesSummary() {
  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <div className="section-header">
          <span className="overline">Layanan Kami</span>
          <h2>Solusi Lengkap untuk Kebutuhan Gedung Anda</h2>
          <p>Dari supply produk hingga maintenance berkelanjutan, kami hadir sebagai mitra andalan.</p>
        </div>

        <div className={styles.grid}>
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={styles.card}>
              <div className={styles.iconWrap}>
                <Icon size={28} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <Link to="/layanan" className="btn btn-outline">
            Lihat Semua Layanan <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}