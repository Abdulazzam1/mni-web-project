import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SettingsProvider } from '@/contexts/SettingsContext'; // <-- IMPORT BARU
import App from './App';
import '@/assets/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <HashRouter>
        {/* BUNGKUS APLIKASI DENGAN SETTINGS PROVIDER */}
        <SettingsProvider> 
          <App />
        </SettingsProvider>
      </HashRouter>
    </HelmetProvider>
  </React.StrictMode>
);