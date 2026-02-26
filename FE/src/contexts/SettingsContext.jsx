import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Sesuaikan dengan port backend Anda (5001)
        const res = await axios.get('http://localhost:5001/api/settings');
        setSettings(res.data);
      } catch (error) {
        console.error('Gagal memuat pengaturan web:', error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loadingSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);