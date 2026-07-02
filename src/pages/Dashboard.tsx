import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    document.body.classList.add('dashboard-page');
    return () => document.body.classList.remove('dashboard-page');
  }, []);

  // Handlers for drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.size > 20 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 20MB.");
      return;
    }
    setFile(selectedFile);
  };

  // Mock data
  const userName = "Fachri A. K.";

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-profile">
              <div className="avatar-large">
                {userName.charAt(0)}
              </div>
              <h3>{userName}</h3>
            </div>
            
            <nav className="sidebar-nav">
              <button 
                className={`sidebar-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <span className="icon">🏠</span> Home
              </button>
              <button 
                className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="icon">👤</span> Profile
              </button>
              <button 
                className={`sidebar-btn ${activeTab === 'proposal' ? 'active' : ''}`}
                onClick={() => setActiveTab('proposal')}
              >
                <span className="icon">📄</span> Proposal
              </button>
            </nav>
          </aside>

          {/* Main Panel */}
          <main className="dashboard-main">
            {activeTab === 'home' && (
              <div className="tab-pane">
                <h2 className="dashboard-title">Riwayat Submit Proposal</h2>
                <div className="history-card">
                  <div className="history-icon">📄</div>
                  <div className="history-info">
                    <h4>Proposal Smart City.pdf</h4>
                    <p>Dikirim pada: 12 Jul 2026</p>
                  </div>
                  <div className="history-status pending">Menunggu Review</div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="tab-pane">
                <h2 className="dashboard-title">Pengaturan Profil</h2>
                <div className="profile-form-card">
                  <div className="profile-avatar-edit">
                    <div className="avatar-preview">{userName.charAt(0)}</div>
                    <div className="avatar-actions">
                      <button className="btn-upload-avatar">Upload Avatar</button>
                      <button className="btn-delete-avatar">Hapus</button>
                    </div>
                  </div>

                  <form className="profile-form" onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                      <label>Nama Lengkap</label>
                      <input type="text" defaultValue={userName} />
                    </div>
                    <div className="form-group">
                      <label>Instansi / Universitas</label>
                      <input type="text" placeholder="Masukkan nama instansi" />
                    </div>
                    <div className="form-group">
                      <label>Nomor Telepon (WhatsApp)</label>
                      <input type="tel" placeholder="Contoh: 081234567890" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" defaultValue="peserta@example.com" />
                    </div>
                    
                    <h3 className="section-subtitle">Ganti Password</h3>
                    <div className="form-group">
                      <label>Password Lama</label>
                      <input type="password" placeholder="Masukkan password lama" />
                    </div>
                    <div className="form-group">
                      <label>Password Baru</label>
                      <input type="password" placeholder="Buat password baru" />
                    </div>
                    
                    <button className="btn-save-profile">Simpan Perubahan</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'proposal' && (
              <div className="tab-pane">
                <h2 className="dashboard-title">Upload Proposal</h2>
                <p className="dashboard-desc">Silakan unggah dokumen proposal inovasi Anda. Maksimal ukuran file adalah 20MB.</p>
                
                <div 
                  className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="file-input-hidden" 
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">📤</div>
                    {file ? (
                      <p className="file-name">Terpilih: {file.name}</p>
                    ) : (
                      <>
                        <p><strong>Pilih File</strong> atau Drag & Drop ke sini</p>
                        <span className="upload-hint">PDF, DOC, DOCX (Max: 20MB)</span>
                      </>
                    )}
                  </label>
                </div>

                {file && (
                  <button className="btn-submit-proposal" onClick={() => alert('Proposal berhasil diunggah!')}>Kirim Proposal Sekarang</button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
