import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Login</h2>
          <p className="auth-subtitle">Masuk ke akun Anda untuk memulai</p>

          <button className="auth-provider-btn huawei-btn" onClick={() => handleLogin()}>
            <img src="/images/Logo-huawei.png" alt="Huawei" className="provider-icon" style={{filter: 'brightness(0) invert(1)', height: '20px', width: 'auto'}} />
            Login via Huawei ID
          </button>

          <button className="auth-provider-btn google-btn" onClick={() => handleLogin()}>
            <svg className="provider-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Login via Google
          </button>

          <div className="auth-divider">atau login dengan email</div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label>Email</label>
              <input type="email" placeholder="Masukkan email Anda" required />
            </div>
            <div className="auth-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ marginBottom: 0 }}>Password</label>
                <a href="#" className="forgot-password-link">Lupa Password?</a>
              </div>
              <input type="password" placeholder="Masukkan password" required />
            </div>
            <button type="submit" className="auth-submit-btn">Login Sekarang</button>
          </form>

          <div className="auth-footer">
            Belum punya akun? <Link to="/register">Daftar Akun</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
