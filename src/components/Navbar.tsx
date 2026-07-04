import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';

const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setHidden(true);
    setMenuOpen(false);
    setDropdownOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setHidden(false), 1200);
  };

  return (
    <nav className={`navbar-pill-wrapper ${hidden ? 'navbar-hidden' : ''}`}>
      <div className="navbar-pill">
        <div className="nav-left">
          <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
            <img src="/images/Logo-huawei.png" alt="Huawei Logo" className="logo-img-pill logo-huawei" />
            <img src="/images/Logo-APTIKOM.png" alt="APTIKOM Logo" className="logo-img-pill logo-aptikom" />
          </Link>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`nav-links-pill ${menuOpen ? 'nav-mobile-open' : ''}`}>
          <a href="/#about" onClick={handleNavClick}>Tentang Program</a>
          <a href="/#benefit" onClick={handleNavClick}>Ketentuan</a>
          
          <div className="nav-dropdown" ref={dropdownRef}>
            <button 
              className={`nav-dropdown-trigger ${dropdownOpen ? 'open' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Lainnya <IoChevronDown className={`dropdown-chevron ${dropdownOpen ? 'rotated' : ''}`} />
            </button>
            <div className={`nav-dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <a href="/#programs" onClick={handleNavClick}>Ruang Lingkup</a>
              <a href="/#events" onClick={handleNavClick}>Jadwal</a>
              <a href="/#faq" onClick={handleNavClick}>FAQ</a>
              <Link to="/pengumuman" onClick={handleNavClick}>Pengumuman</Link>
            </div>
          </div>

          {/* Mobile Only Button */}
          <Link to="/kirim-proposal" className="btn-kirim-mobile" onClick={handleNavClick}>
            Kirim Proposal
          </Link>
        </div>

        <div className="nav-right">
          <Link to="/kirim-proposal" className="btn-kirim-proposal">
            Kirim Proposal
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
