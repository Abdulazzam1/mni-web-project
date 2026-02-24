import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/services/api'; // <-- KOREKSI 1: Import file api

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);

  // Cek sesi saat mount (token tersimpan di localStorage)
  useEffect(() => {
    const token = localStorage.getItem('mni_token');
    const saved  = localStorage.getItem('mni_user');
    if (token && saved) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    
    // <-- KOREKSI 2: Menyesuaikan dengan format response sendSuccess MNI
    const payload = res.data.data || res.data; 
    const { token, user: u } = payload;

    localStorage.setItem('mni_token', token);
    localStorage.setItem('mni_user', JSON.stringify(u));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mni_token');
    localStorage.removeItem('mni_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return ctx;
};