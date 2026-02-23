import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page-enter">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}