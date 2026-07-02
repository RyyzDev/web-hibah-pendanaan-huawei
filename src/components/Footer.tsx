import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        <div className="footer-column brand-column">
          <div className="footer-logos">
            <img src="/images/Logo-huawei.png" alt="Huawei Logo" className="footer-logo" />
            <img src="/images/Logo-APTIKOM.png" alt="APTIKOM Logo" className="footer-logo" />
          </div>
          <p className="footer-description">
            Program Hibah Pendanaan Project Based Learning untuk mendorong inovasi dan pemanfaatan teknologi digital guna menyelesaikan masalah nyata di masyarakat.
          </p>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Navigasi</h4>
          <ul className="footer-links">
            <li><a href="#home">Beranda</a></li>
            <li><a href="#about">Tentang Program</a></li>
            <li><a href="#programs">Ruang Lingkup</a></li>
            <li><a href="#events">Jadwal & Tahapan</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Kontak</h4>
          <ul className="footer-contact">
            <li><strong>Phone:</strong><a href="https://wa.me/6287804487981">+62 878 0448 7981</a></li>
            <li><strong>Address:</strong>Jakarta, Indonesia</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} <a href="https://github.com/RyyzDev">RyyzDev.</a> All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
