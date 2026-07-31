import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim() || form.name.trim().length < 2) err.name = 'Nama minimal 2 karakter';
    if (!form.email.trim()) err.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Format email tidak valid';
    if (!form.password || form.password.length < 6) err.password = 'Password minimal 6 karakter';
    if (form.password !== form.confirm) err.confirm = 'Konfirmasi password tidak cocok';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 'weak', label: 'Lemah', color: '#ff4d4d' };
    if (score <= 3) return { level: 'medium', label: 'Sedang', color: '#FFD700' };
    return { level: 'strong', label: 'Kuat', color: '#00c16a' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setServerError(err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            ☕ Kopi <span>Kombo</span>
          </Link>
          <p className="auth-tagline">Bergabung dan nikmati kopi terbaik Yogyakarta!</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Buat Akun Baru</h1>
            <p>Sudah punya akun? <Link to="/login" className="auth-link">Masuk di sini</Link></p>
          </div>

          {serverError && (
            <div className="auth-alert auth-alert-error">
              <i className="fas fa-exclamation-circle" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">
                <i className="fas fa-user" /> Nama Lengkap
              </label>
              <input
                id="reg-name"
                type="text"
                name="name"
                className={`form-control${errors.name ? ' error' : ''}`}
                placeholder="Nama lengkap kamu"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="error-msg"><i className="fas fa-times-circle" /> {errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">
                <i className="fas fa-envelope" /> Email
              </label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-password" className="form-label">
                <i className="fas fa-lock" /> Password
              </label>
              <div className="input-password-wrapper">
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className={`form-control${errors.password ? ' error' : ''}`}
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {form.password && strength && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1,2,3].map(i => (
                      <div
                        key={i}
                        className="strength-bar"
                        style={{
                          background: i <= (strength.level === 'weak' ? 1 : strength.level === 'medium' ? 2 : 3)
                            ? strength.color : 'var(--dark-4)'
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ color: strength.color, fontSize: '0.75rem', fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
              {errors.password && <span className="error-msg"><i className="fas fa-times-circle" /> {errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">
                <i className="fas fa-lock" /> Konfirmasi Password
              </label>
              <div className="input-password-wrapper">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  className={`form-control${errors.confirm ? ' error' : ''}`}
                  placeholder="Ulangi password"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowConfirm(s => !s)} tabIndex={-1}>
                  <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {errors.confirm && <span className="error-msg"><i className="fas fa-times-circle" /> {errors.confirm}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin" /> Mendaftarkan...</>
              ) : (
                <><i className="fas fa-user-plus" /> Daftar Sekarang</>
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
