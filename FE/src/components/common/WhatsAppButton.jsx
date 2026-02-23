import { MessageCircle } from 'lucide-react';
import { COMPANY } from '@/utils/constants';
import { waUrl } from '@/utils/formatters';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
  const url = waUrl(
    COMPANY.whatsapp,
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