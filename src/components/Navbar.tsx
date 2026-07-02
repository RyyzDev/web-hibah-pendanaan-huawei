import React, { useState, useEffect, useRef } from 'react';

const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
        setMenuOpen(false);
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

  return (
    <nav className={`navbar-pill-wrapper ${hidden ? 'navbar-hidden' : ''}`}>
      <div className="navbar-pill">
        <div className="logo-container">
          <img src="/images/Logo-huawei.png" alt="Huawei Logo" className="logo-img-pill logo-huawei" />
          <img src="/images/Logo-APTIKOM.png" alt="APTIKOM Logo" className="logo-img-pill logo-aptikom" />
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`nav-links-pill ${menuOpen ? 'nav-mobile-open' : ''}`}>
          <a href="#about" onClick={handleNavClick}>Tentang Program</a>
          <a href="#benefit" onClick={handleNavClick}>Benefit</a>
          <a href="#programs" onClick={handleNavClick}>Ruang Lingkup</a>
          <a href="#events" onClick={handleNavClick}>Jadwal</a>
        </div>
        <div className="nav-actions">
          <button className="btn-login">Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
