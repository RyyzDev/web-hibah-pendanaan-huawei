import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Popup, { type PopupType } from '../components/Popup';
import { supabase } from '../utils/supabase';
import './Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState<{isOpen: boolean; type: PopupType; title: string; message: string}>({
    isOpen: false, type: 'error', title: '', message: ''
  });

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        setPopup({
          isOpen: true,
          type: 'error',
          title: 'Gagal Login',
          message: 'Username atau password yang Anda masukkan salah!'
        });
        return;
      }

      // Login berhasil
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('adminUser', username);
      localStorage.setItem('adminPass', password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Koneksi Error',
        message: 'Terjadi kesalahan saat menghubungi database.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Admin Login</h2>
          <p className="auth-subtitle">Masuk ke panel admin</p>

          <div className="auth-divider">login dengan akun admin</div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label>Username</label>
              <input 
                type="text" 
                placeholder="Masukkan username" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Masukkan password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Login Sekarang'}
            </button>
          </form>
        </div>
      </div>

      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />
    </>
  );
};

export default Login;
