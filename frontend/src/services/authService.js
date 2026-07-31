import api from './api';

// Register user baru
export const register = (data) => api.post('/auth/register', data);

// Login
export const login = (data) => api.post('/auth/login', data);

// Ambil profil user (perlu token)
export const getProfile = () => api.get('/auth/profile');

// Update profil
export const updateProfile = (data) => api.put('/auth/profile', data);

// Ganti password
export const changePassword = (data) => api.put('/auth/change-password', data);

// Simpan token ke localStorage
export const saveToken = (token) => localStorage.setItem('token', token);

// Ambil token dari localStorage
export const getToken = () => localStorage.getItem('token');

// Hapus token (logout)
export const removeToken = () => localStorage.removeItem('token');

// Cek apakah user sudah login
export const isLoggedIn = () => !!localStorage.getItem('token');

// Simpan info user ke localStorage
export const saveUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Ambil info user
export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Hapus info user (logout)
export const removeUser = () => localStorage.removeItem('user');

// Logout lengkap
export const logout = () => {
  removeToken();
  removeUser();
};
