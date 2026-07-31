import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <h2 className="footer-brand">Kopi <span>Kombo</span>.</h2>
          <p className="footer-desc">
            Cafe modern dengan konsep premium aesthetic untuk nongkrong dan santai. Harga mahasiswa dengan cita rasa bintang lima.
          </p>
          <div className="footer-social">
            <a href="https://www.instagram.com/kopikombo?igsh=MTRibzdwY2poc3B5dA==" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram" />
            </a>
            <a href="https://www.tiktok.com/@kopikombo?_r=1&_t=ZS-96AVyyS3mi4" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-tiktok" />
            </a>
            <a href="https://wa.me/6282322115127" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp" />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Link Cepat</h3>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu Selection</Link>
          <Link to="/gallery">Galeri Cafe</Link>
          <Link to="/reservasi">Booking Meja</Link>
          <Link to="/rekomendasi">Rekomendasi</Link>
        </div>

        <div className="footer-col">
          <h3>Jam Operasional</h3>
          <p>Senin - Minggu</p>
          <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>24 Jam Nonstop</p>
        </div>

        <div className="footer-col">
          <h3>Kontak Kami</h3>
          <p><i className="fas fa-phone-alt" style={{ marginRight: '8px', color: 'var(--primary)' }} /> +62 823-2211-5127</p>
          <p><i className="fas fa-envelope" style={{ marginRight: '8px', color: 'var(--primary)' }} /> kopikombo@gmail.com</p>
          <p><i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: 'var(--primary)' }} /> Gejayan, Yogyakarta</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Kopi Kombo Premium Cafe. All Rights Reserved.</p>
        <p>Created for UAS Fullstack Development</p>
      </div>
    </footer>
  );
}
