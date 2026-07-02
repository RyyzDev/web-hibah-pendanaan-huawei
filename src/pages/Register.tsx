import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Auth.css';

const Register: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Daftar Akun</h2>
          <p className="auth-subtitle">Buat akun untuk mendaftarkan proposal Anda</p>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-input-group">
              <label>Nama Lengkap</label>
              <input type="text" placeholder="Masukkan nama lengkap" required />
            </div>
            <div className="auth-input-group">
              <label>Email</label>
              <input type="email" placeholder="Masukkan email aktif" required />
            </div>
            <div className="auth-input-group">
              <label>Password</label>
              <input type="password" placeholder="Buat password" required />
            </div>
            <div className="auth-input-group">
              <label>Konfirmasi Password</label>
              <input type="password" placeholder="Ulangi password" required />
            </div>
            <button type="submit" className="auth-submit-btn">Daftar Sekarang</button>
          </form>

          <div className="auth-footer">
            Sudah punya akun? <Link to="/login">Login di sini</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
