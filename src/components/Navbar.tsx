import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
        setMenuOpen(false);
        setDropdownOpen(false);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setHidden(true);
    setMenuOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setHidden(false), 1200);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className={`navbar-pill-wrapper ${hidden ? 'navbar-hidden' : ''}`}>
      <div className="navbar-pill">
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
          <img src="/images/Logo-huawei.png" alt="Huawei Logo" className="logo-img-pill logo-huawei" />
          <img src="/images/Logo-APTIKOM.png" alt="APTIKOM Logo" className="logo-img-pill logo-aptikom" />
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`nav-links-pill ${menuOpen ? 'nav-mobile-open' : ''}`}>
          <a href="/#about" onClick={handleNavClick}>Tentang Program</a>
          <a href="/#benefit" onClick={handleNavClick}>Ketentuan & Benefit</a>
          <a href="/#programs" onClick={handleNavClick}>Ruang Lingkup</a>
          <a href="/#events" onClick={handleNavClick}>Jadwal</a>
          <a href="/#faq" onClick={handleNavClick}>FAQ</a>
        </div>
        
        <div className={`nav-actions ${menuOpen ? 'nav-mobile-open' : ''}`}>
          {isLoggedIn ? (
            <div className="profile-dropdown-container" style={{ position: 'relative' }}>
              <div 
                className="profile-avatar" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #ff4d4d, #c6000f)', 
                  color: 'white', display: 'flex', justifyContent: 'center', 
                  alignItems: 'center', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(198,0,15,0.3)',
                  userSelect: 'none'
                }}
              >
                F
              </div>
              {dropdownOpen && (
                <div className="profile-dropdown-menu" style={{
                  position: 'absolute', top: '120%', right: '0', background: 'white',
                  borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '0.5rem', minWidth: '150px', display: 'flex', flexDirection: 'column',
                  gap: '0.2rem'
                }}>
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)} style={{
                    padding: '0.8rem 1rem', textDecoration: 'none', color: '#333', 
                    borderRadius: '8px', fontWeight: '600', transition: 'background 0.2s'
                  }} onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} style={{
                    padding: '0.8rem 1rem', border: 'none', background: 'transparent',
                    color: '#c6000f', textAlign: 'left', fontWeight: '600', borderRadius: '8px',
                    cursor: 'pointer', transition: 'background 0.2s', fontSize: '1rem'
                  }} onMouseOver={e => e.currentTarget.style.background = 'rgba(198,0,15,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-login" style={{ textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
