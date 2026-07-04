import React from 'react';
import { Link } from 'react-router-dom';

const CTA: React.FC = () => {
  return (
    <section id="cta" className="cta-section">
      <div className="cta-glow cta-glow-1"></div>
      <div className="cta-glow cta-glow-2"></div>
      <div className="cta-container">
        <span className="cta-badge">🚀 Pendaftaran Masih Dibuka</span>
        <h2 className="cta-title">
          Siap Mewujudkan <span className="cta-highlight">Inovasimu?</span>
        </h2>
        <p className="cta-description">
          Jangan lewatkan kesempatan emas untuk mendapatkan pendanaan hingga jutaan rupiah. 
          Daftarkan proposal terbaikmu sekarang dan jadilah bagian dari perubahan nyata!
        </p>
        <div className="cta-actions">
          <Link to="/kirim-proposal" style={{ textDecoration: 'none' }}>
            <button className="cta-btn-primary">
              Kirim Proposal Sekarang
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </Link>
          <a href="https://wa.me/6287804487981" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="cta-btn-secondary">
              💬 Hubungi Kami
            </button>
          </a>
        </div>
        <p className="cta-note">⏱ Batas akhir pendaftaran: <strong>20 Juli 2026, 23:59 WIB</strong></p>
      </div>
    </section>
  );
};

export default CTA;
