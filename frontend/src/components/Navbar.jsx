import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu-coffee', label: 'Menu Kopi' },
    { to: '/menu-non-coffee', label: 'Menu Non-Kopi' },
    { to: '/promo', label: 'Promo' },
    { to: '/gallery', label: 'Galeri' },
    { to: '/reservasi', label: 'Reservasi' },
    { to: '/contact', label: 'Kontak' },
    { to: '/cs', label: 'CS Support' },
    { to: '/rekomendasi', label: 'Rekomendasi' },
  ];

  const avatarInitials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <header>
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            Kopi <span>Kombo</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="nav-icons">
            <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
              <i className="fas fa-heart" />
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="nav-icon-btn" title="Keranjang">
              <i className="fas fa-shopping-cart" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* User area */}
            {isLoggedIn ? (
              <div className="user-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="user-avatar-btn"
                  onClick={() => setDropdownOpen(d => !d)}
                  title={user?.name}
                >
                  <span className="user-avatar-initials">{avatarInitials}</span>
                  <span className="user-avatar-name">{user?.name?.split(' ')[0]}</span>
                  <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'} user-chevron`} />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-dropdown-avatar">{avatarInitials}</div>
                      <div>
                        <p className="user-dropdown-name">{user?.name}</p>
                        <p className="user-dropdown-email">{user?.email}</p>
                        <span className={`user-dropdown-role ${user?.role === 'admin' ? 'role-admin' : 'role-customer'}`}>
                          {user?.role === 'admin' ? '👑 Admin' : '☕ Customer'}
                        </span>
                      </div>
                    </div>
                    <div className="user-dropdown-divider" />
                    <Link to="/profile" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-user" /> Profil Saya
                    </Link>
                    <Link to="/orders" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-shopping-bag" /> Riwayat Pesanan
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="user-dropdown-item user-dropdown-admin" onClick={() => setDropdownOpen(false)}>
                        <i className="fas fa-tachometer-alt" /> Dashboard Admin
                      </Link>
                    )}
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-item user-dropdown-logout" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary navbar-login-btn">
                <i className="fas fa-sign-in-alt" /> Masuk
              </Link>
            )}

            {/* Hamburger */}
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {label}
          </NavLink>
        ))}
        <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>
          Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
        </NavLink>
        <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
          Keranjang {cartCount > 0 && `(${cartCount})`}
        </NavLink>
        <div className="mobile-menu-divider" />
        {isLoggedIn ? (
          <>
            <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
              <i className="fas fa-user" /> Profil — {user?.name}
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-tachometer-alt" /> Dashboard Admin
              </NavLink>
            )}
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="mobile-login-link" onClick={() => setMenuOpen(false)}>
            <i className="fas fa-sign-in-alt" /> Masuk / Daftar
          </NavLink>
        )}
      </div>
    </>
  );
}
