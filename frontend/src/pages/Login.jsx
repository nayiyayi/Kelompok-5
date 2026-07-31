import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const err = {};
    if (!form.email.trim()) err.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Format email tidak valid';
    if (!form.password) err.password = 'Password wajib diisi';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Login gagal. Periksa email dan password kamu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      {/* Background particles */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      <div className="auth-container">
        {/* Brand */}
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            ☕ Kopi <span>Kombo</span>
          </Link>
          <p className="auth-tagline">Selamat datang kembali, pecinta kopi!</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Masuk ke Akun</h1>
            <p>Belum punya akun? <Link to="/register" className="auth-link">Daftar sekarang</Link></p>
          </div>

          {serverError && (
            <div className="auth-alert auth-alert-error">
              <i className="fas fa-exclamation-circle" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                <i className="fas fa-envelope" /> Email
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                className={`form-control${errors.email ? ' error' : ''}`}
                placeholder="contoh@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className="error-msg"><i className="fas fa-times-circle" /> {errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                <i className="fas fa-lock" /> Password
              </label>
              <div className="input-password-wrapper">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className={`form-control${errors.password ? ' error' : ''}`}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPass(s => !s)}
                  tabIndex={-1}
                >
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {errors.password && <span className="error-msg"><i className="fas fa-times-circle" /> {errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin" /> Memproses...</>
              ) : (
                <><i className="fas fa-sign-in-alt" /> Masuk Sekarang</>
              )}
            </button>
          </form>


        </div>

        <p className="auth-footer-text">
          <Link to="/" className="auth-back-link">
            <i className="fas fa-arrow-left" /> Kembali ke Beranda
          </Link>
        </p>
      </div>
    </main>
  );
}
