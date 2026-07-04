import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../utils/supabase';
import './Pengumuman.css';
import { IoMegaphone, IoRibbon } from 'react-icons/io5';



const Pengumuman: React.FC = () => {
  const [fundedProposals, setFundedProposals] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Pengumuman | Hibah Pendanaan PBL Huawei";
    
    const fetchFundedProposals = async () => {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .eq('status', 'Didanai')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setFundedProposals(data);
        }
      } catch (err) {
        console.error('Failed to fetch funded proposals', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFundedProposals();
  }, []);

  return (
    <>
      <Navbar />
      <div className="pengumuman-page">
        <div className="pengumuman-hero">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
          <div className="pengumuman-hero-content">
            <div className="icon-wrapper">
              <IoRibbon className="megaphone-icon" />
            </div>
            <h1>Penerima <span className="text-gradient">Pendanaan</span></h1>
            <p>Daftar proposal terpilih yang berhak menerima hibah pendanaan PBL Huawei ICT Academy tahun ini.</p>
          </div>
        </div>

        <div className="pengumuman-container">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Memuat data pengumuman...</div>
          ) : fundedProposals.length > 0 ? (
            <div className="winners-banner" style={{ background: 'linear-gradient(135deg, #c6000f, #7a0009)', color: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(198, 0, 15, 0.2)' }}>
              <div className="winners-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {fundedProposals.map(p => (
                  <div key={p.id} className="winner-card" style={{ background: 'rgba(255,255,255,0.1)', padding: '1.8rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', transition: 'transform 0.3s ease' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '12px', lineHeight: '1.4' }}>{p.judul}</div>
                    <div style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '4px' }}><strong>Ketua:</strong> {p.nama_lengkap}</div>
                    <div style={{ fontSize: '1rem', opacity: 0.9 }}><strong>Instansi:</strong> {p.instansi}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f9f9f9', borderRadius: '16px', border: '1px dashed #ddd' }}>
              <IoMegaphone style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }} />
              <h3 style={{ color: '#555', margin: '0 0 10px 0' }}>Belum Ada Pengumuman</h3>
              <p style={{ color: '#777', margin: 0 }}>Daftar penerima pendanaan belum diumumkan atau sedang dalam proses seleksi.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Pengumuman;
