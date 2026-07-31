import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <video autoPlay muted loop playsInline className="video-bg">
        <source src="/video1.mp4" type="video/mp4" />
        Browser Anda tidak mendukung video background.
      </video>
      <div className="video-overlay"></div>
      <div className="hero-content">
        <span className="hero-topline">Kopi Kombo • satu kombinasi, sejuta kenikmatan</span>
        <h1 className="hero-brand">Kopi <span className="highlight">Kombo</span></h1>
        <p className="hero-desc">
          Tempat nongkrong aesthetic dengan cita rasa premium, vibes cafe modern Jogja, dan harga mahasiswa. Buka 24 jam nonstop dengan WiFi cepat dan suasana cozy.
        </p>
        <div className="hero-buttons">
          <a href="https://wa.me/6282322115127" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <i className="fab fa-whatsapp" /> Order WhatsApp
          </a>
          <Link to="/reservasi" className="btn btn-primary">
            <i className="fas fa-chair" /> Booking Meja
          </Link>
        </div>
      </div>
    </section>
  );
}
