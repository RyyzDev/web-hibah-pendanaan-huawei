import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound: React.FC = () => {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '6rem', color: 'var(--huawei-red)', marginBottom: '1rem', fontWeight: 900 }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>Halaman Tidak Ditemukan</h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2.5rem', maxWidth: '500px' }}>
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link to="/" style={{
          background: 'linear-gradient(135deg, #c6000f, #a3000c)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '50px',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 10px 25px rgba(198, 0, 15, 0.4)'
        }}>
          Kembali ke Beranda
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
