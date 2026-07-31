import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginService, register as registerService, logout as logoutService, saveToken, saveUser, getToken, getUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load dari localStorage saat pertama kali mount
  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginService({ email, password });
    const { token: t, user: u } = res.data;
    saveToken(t);
    saveUser(u);
    setToken(t);
    setUser(u);
    return res.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await registerService({ name, email, password });
    const { token: t, user: u } = res.data;
    saveToken(t);
    saveUser(u);
    setToken(t);
    setUser(u);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setToken(null);
    setUser(null);
  }, []);

  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, isLoggedIn, isAdmin, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
