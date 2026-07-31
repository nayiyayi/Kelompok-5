import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container error-state animate-fade-up">
        <i className="fas fa-ghost" style={{ fontSize: '5rem', color: 'var(--primary)', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>404</h1>
        <h3>Halaman Tidak Ditemukan</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem' }}>
          Maaf, halaman kopi yang kamu cari tidak tersedia atau sudah dipindahkan ke tempat lain.
        </p>
        <Link to="/" className="btn btn-primary">
          <i className="fas fa-home" /> Kembali ke Home
        </Link>
      </div>
    </main>
  );
}
