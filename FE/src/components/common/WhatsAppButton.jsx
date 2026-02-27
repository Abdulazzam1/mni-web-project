import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext'; 
import { COMPANY } from '@/utils/constants';
import { waUrl } from '@/utils/formatters';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
  // 1. Mengambil data settings dari CMS
  const { settings } = useSettings();

  // 2. Mengutamakan nomor Sales dari CMS, jika kosong/loading kembali ke default
  const targetNumber = settings?.contact_sales || COMPANY.whatsapp;

  const url = waUrl(
    targetNumber,
    'Halo, saya ingin menanyakan produk/layanan MNI.'
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={styles.btn}
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={26} />
      <span className={styles.tooltip}>Chat WhatsApp</span>
    </a>
  );
}