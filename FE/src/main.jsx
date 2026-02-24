import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // <-- 1. Ubah di sini
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import '@/assets/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <HashRouter> {/* <-- 2. Ubah di sini */}
        <App />
      </HashRouter>
    </HelmetProvider>
  </React.StrictMode>
);