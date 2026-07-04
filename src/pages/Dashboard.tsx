import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { IoDocumentText, IoLogOutOutline, IoClipboard, IoHourglass, IoCheckmarkCircle, IoCloseCircle, IoMenu, IoClose, IoChevronDown, IoChevronUp, IoRibbon, IoWarningOutline } from 'react-icons/io5';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { supabase } from '../utils/supabase';
import Popup, { type PopupType } from '../components/Popup';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type SidebarItem = {
  key: string;
  icon: React.ElementType;
  label: string;
  children?: { key: string; label: string }[];
};

const sidebarItems: SidebarItem[] = [
  { key: 'dashboard', icon: MdDashboard, label: 'Dashboard' },
  { 
    key: 'riwayat', 
    icon: IoDocumentText, 
    label: 'Proposal',
    children: [
      { key: 'riwayat_semua', label: 'Semua Proposal' },
      { key: 'riwayat_menunggu', label: 'Menunggu Diverifikasi' },
      { key: 'riwayat_diterima', label: 'Diterima' },
      { key: 'riwayat_ditolak', label: 'Ditolak' },
    ]
  },
  { key: 'finalisasi', icon: IoRibbon, label: 'Finalisasi Penerima' }
];

function getStatusClass(status: string): string {
  if (status === 'Menunggu Review') return 'menunggu';
  if (status === 'Diterima') return 'diterima';
  if (status === 'Ditolak') return 'ditolak';
  if (status === 'Didanai') return 'didanai';
  return '';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['riwayat']);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [proposals, setProposals] = useState<Record<string, unknown>[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Record<string, unknown> | null>(null);
  const [confirmAction, setConfirmAction] = useState<'terima' | 'tolak' | 'alasan_tolak' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [finalisasiSelections, setFinalisasiSelections] = useState<string[]>([]);
  const [isFinalisasiSubmitting, setIsFinalisasiSubmitting] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [lockConfirmText, setLockConfirmText] = useState('');
  const [popup, setPopup] = useState<{isOpen: boolean; type: PopupType; title: string; message: string}>({
    isOpen: false, type: 'success', title: '', message: ''
  });

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/admin/login');
      return;
    }
    document.body.classList.add('dashboard-page');
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, [navigate]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching proposals:', error);
      } else {
        // Map data to match component expectations
        const mappedData = data.map((item: Record<string, unknown>) => ({
          ...item,
          ketua: item.nama_lengkap,
          tanggal: new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }));
        setProposals(mappedData || []);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProposals();
  }, []);

  const handleUpdateStatus = async (status: string, alasan: string = '') => {
    if (!selectedProposal) return;
    try {
      const adminUser = localStorage.getItem('adminUser');
      const adminPass = localStorage.getItem('adminPass');

      // Panggil RPC aman
      const { error } = await supabase.rpc('admin_update_proposal', {
        p_id: selectedProposal.id,
        p_status: status,
        p_alasan: alasan,
        p_username: adminUser,
        p_password: adminPass
      });
        
      if (error) throw error;
      
      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Berhasil',
        message: `Proposal berhasil di${status === 'Diterima' ? 'terima' : 'tolak'}.`
      });
      setConfirmAction(null);
      setRejectReason('');
      setSelectedProposal(null);
      fetchProposals();
    } catch (err: unknown) {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Terjadi Kesalahan',
        message: 'Gagal mengupdate status: ' + (err as Error).message
      });
    }
  };

  const handleToggleSelection = (id: string) => {
    setFinalisasiSelections(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExecuteLockFinalisasi = async () => {
    setIsFinalisasiSubmitting(true);
    try {
      const adminUser = localStorage.getItem('adminUser');
      const adminPass = localStorage.getItem('adminPass');

      const { error } = await supabase.rpc('admin_update_multiple_proposals', {
        p_ids: finalisasiSelections,
        p_status: 'Didanai',
        p_username: adminUser,
        p_password: adminPass
      });
        
      if (error) throw error;
      
      setPopup({ isOpen: true, type: 'success', title: 'Berhasil', message: 'Finalisasi berhasil dikunci. Penerima pendanaan telah ditetapkan.'});
      fetchProposals();
      setShowLockConfirm(false);
    } catch (err: unknown) {
      setPopup({ isOpen: true, type: 'error', title: 'Gagal', message: 'Gagal mengupdate status: ' + (err as Error).message});
    } finally {
      setIsFinalisasiSubmitting(false);
    }
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  const handleCloseMobileOverlay = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const handleNavClick = (key: string, hasChildren: boolean) => {
    if (hasChildren) {
      setExpandedKeys(prev => 
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    } else {
      setActiveTab(key);
      if (isMobile) setMobileOpen(false);
    }
  };

  const sidebarClasses = [
    'dashboard-sidebar',
    !sidebarOpen && !isMobile ? 'collapsed' : '',
    isMobile && mobileOpen ? 'mobile-open' : '',
    isMobile && !mobileOpen ? 'collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Compute dynamic stats
  const totalProposal = proposals.length;
  const menungguReview = proposals.filter(p => p.status === 'Menunggu Review').length;
  const diterima = proposals.filter(p => p.status === 'Diterima').length;
  const ditolak = proposals.filter(p => p.status === 'Ditolak').length;

  const stats = [
    { label: 'Total Proposal', value: totalProposal, icon: IoClipboard, bg: 'rgba(198,0,15,0.08)' },
    { label: 'Menunggu Review', value: menungguReview, icon: IoHourglass, bg: '#fff3cd' },
    { label: 'Diterima', value: diterima, icon: IoCheckmarkCircle, bg: '#d4edda' },
    { label: 'Ditolak', value: ditolak, icon: IoCloseCircle, bg: '#f8d7da' },
  ];

  // Chart configs
  const barData = {
    labels: ['Apr', 'Mei', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Proposal Masuk',
        data: [0, 0, 1, 3],
        backgroundColor: 'rgba(198,0,15,0.8)',
        borderRadius: 4,
      }
    ]
  };

  const pieData = {
    labels: ['Menunggu', 'Diterima', 'Ditolak'],
    datasets: [
      {
        data: [menungguReview, diterima, ditolak],
        backgroundColor: ['#ffc107', '#28a745', '#dc3545'],
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#ffffff'
        }
      }
    }
  };

  const filteredProposals = proposals.filter(p => {
    if (activeTab === 'riwayat_menunggu') return p.status === 'Menunggu Review';
    if (activeTab === 'riwayat_diterima') return p.status === 'Diterima';
    if (activeTab === 'riwayat_ditolak') return p.status === 'Ditolak';
    return true; // dashboard, riwayat, riwayat_semua
  });

  return (
    <div className="dashboard-layout">
      <div
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={handleCloseMobileOverlay}
      />

      {isMobile && (
        <button className="mobile-toggle-btn" onClick={handleToggleSidebar}>
          <IoMenu />
        </button>
      )}

      <aside className={sidebarClasses}>
        {!isMobile && (
          <button className="sidebar-toggle" onClick={handleToggleSidebar}>
            {sidebarOpen ? <IoClose /> : <IoMenu />}
          </button>
        )}
        {isMobile && (
          <button className="sidebar-toggle" onClick={handleToggleSidebar}>
            <IoClose />
          </button>
        )}

        <div className="sidebar-profile">
          <div className="sidebar-avatar">A</div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">Admin Panel</div>
            <div className="sidebar-profile-role">Administrator</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <div key={item.key} className="sidebar-item-container">
              <button
                className={`sidebar-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.key, !!item.children)}
              >
                <span className="sidebar-item-icon"><item.icon /></span>
                <span className="sidebar-item-label">{item.label}</span>
                {item.children && (
                  <span className="sidebar-item-chevron">
                    {expandedKeys.includes(item.key) ? <IoChevronUp /> : <IoChevronDown />}
                  </span>
                )}
              </button>
              
              {item.children && expandedKeys.includes(item.key) && sidebarOpen && (
                <div className="sidebar-subitems">
                  {item.children.map(child => (
                    <button
                      key={child.key}
                      className={`sidebar-subitem ${activeTab === child.key ? 'active' : ''}`}
                      onClick={() => handleNavClick(child.key, false)}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="sidebar-spacer" />
          <button className="sidebar-item logout" onClick={handleLogout}>
            <span className="sidebar-item-icon"><IoLogOutOutline /></span>
            <span className="sidebar-item-label">Logout</span>
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dashboard Admin</h1>
          <p>Selamat datang di panel administrasi proposal pendanaan Huawei.</p>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="stats-grid">
              {stats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <div className="stat-icon" style={{ background: stat.bg }}>
                    <stat.icon />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">{stat.label}</span>
                    <span className="stat-value">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Tren Pengajuan Proposal</h3>
                <div className="chart-wrapper">
                  <Bar data={barData} options={chartOptions} />
                </div>
              </div>
              <div className="chart-card">
                <h3>Status Proposal</h3>
                <div className="chart-wrapper">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>
          </>
        )}

        {(activeTab.startsWith('riwayat') || activeTab === 'dashboard') && (
          <section className="proposal-section">
            <h2 className="proposal-section-title">
              {activeTab === 'riwayat_menunggu' ? 'Proposal Menunggu Diverifikasi' :
               activeTab === 'riwayat_diterima' ? 'Proposal Diterima' :
               activeTab === 'riwayat_ditolak' ? 'Proposal Ditolak' :
               'Riwayat Pengajuan Proposal'}
            </h2>
            <div className="proposal-list">
              {filteredProposals.length > 0 ? filteredProposals.map((p) => (
                <div className="proposal-card" key={p.id} onClick={() => setSelectedProposal(p)}>
                  <div className="proposal-doc-icon"><IoDocumentText /></div>
                  <div className="proposal-info">
                    <div className="proposal-title">{p.judul}</div>
                    <div className="proposal-meta">
                      {p.ketua} &middot; {p.instansi}
                    </div>
                  </div>
                  <div className="proposal-right">
                    <span className="proposal-date">{p.tanggal}</span>
                    <span className={`proposal-status ${getStatusClass(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="no-data">Tidak ada data proposal untuk status ini.</div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'finalisasi' && (() => {
          const diterimaProposals = proposals.filter(p => p.status === 'Diterima' || p.status === 'Didanai');
          const hasDidanai = proposals.some(p => p.status === 'Didanai');
          
          return (
            <section className="proposal-section">
              <h2 className="proposal-section-title">Finalisasi Penerima</h2>
              {hasDidanai ? (
                <div className="finalisasi-content">
                  <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', borderRadius: '12px', marginBottom: '20px', border: '1px solid #c3e6cb' }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                      <IoRibbon /> Finalisasi Telah Terkunci
                    </strong>
                    <p style={{ marginTop: '8px', marginBottom: 0 }}>Berikut adalah daftar proposal yang telah terpilih secara final untuk menerima pendanaan. Pemilihan ini sudah dikunci permanen.</p>
                  </div>
                  <div className="proposal-list">
                    {diterimaProposals.filter(p => p.status === 'Didanai').map((p) => (
                      <div className="proposal-card" key={p.id} onClick={() => setSelectedProposal(p)}>
                        <div className="proposal-doc-icon"><IoDocumentText /></div>
                        <div className="proposal-info">
                          <div className="proposal-title">{p.judul}</div>
                          <div className="proposal-meta">
                            {p.ketua} &middot; {p.instansi}
                          </div>
                        </div>
                        <div className="proposal-right">
                          <span className={`proposal-status ${getStatusClass(p.status)}`}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="finalisasi-content">
                  <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <p style={{ color: '#555', margin: 0, flex: '1 1 auto' }}>
                      Pilih proposal yang berhak mendapatkan pendanaan, lalu klik <strong>Kunci Finalisasi</strong>. 
                    </p>
                    <button 
                      onClick={() => setShowLockConfirm(true)}
                      disabled={finalisasiSelections.length === 0}
                      className="btn-kunci-finalisasi"
                      style={{ 
                        padding: '12px 24px', 
                        background: finalisasiSelections.length > 0 ? '#c6000f' : '#ccc', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: finalisasiSelections.length > 0 ? 'pointer' : 'not-allowed', 
                        fontWeight: 'bold',
                        transition: 'all 0.3s'
                      }}
                    >
                      Kunci Finalisasi ({finalisasiSelections.length})
                    </button>
                  </div>
                  
                  <div className="proposal-list">
                    {diterimaProposals.length > 0 ? diterimaProposals.map(p => (
                      <div className="proposal-card" key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div onClick={(e) => e.stopPropagation()} style={{ padding: '0 10px' }}>
                          <input 
                            type="checkbox" 
                            style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#c6000f' }}
                            checked={finalisasiSelections.includes(p.id)}
                            onChange={() => handleToggleSelection(p.id)}
                          />
                        </div>
                        <div className="proposal-doc-icon" onClick={() => setSelectedProposal(p)} style={{cursor: 'pointer'}}><IoDocumentText /></div>
                        <div className="proposal-info" onClick={() => setSelectedProposal(p)} style={{cursor: 'pointer', flex: 1}}>
                          <div className="proposal-title">{p.judul}</div>
                          <div className="proposal-meta">
                            {p.ketua} &middot; {p.instansi}
                          </div>
                        </div>
                        <div className="proposal-right" onClick={() => setSelectedProposal(p)} style={{cursor: 'pointer'}}>
                          <span className={`proposal-status ${getStatusClass(p.status)}`}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="no-data">Belum ada proposal dengan status Diterima. Verifikasi proposal terlebih dahulu.</div>
                    )}
                  </div>
                </div>
              )}
            </section>
          );
        })()}

      </main>

      {/* Modal Detail Proposal */}
      {selectedProposal && (
        <div className="modal-overlay" onClick={() => { setSelectedProposal(null); setConfirmAction(null); setRejectReason(''); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setSelectedProposal(null); setConfirmAction(null); setRejectReason(''); }}>
              <IoClose />
            </button>
            <h2 className="modal-title">Detail Proposal</h2>
            
            <div className="modal-detail-group">
              <label>Judul Proposal</label>
              <div className="modal-detail-value">{selectedProposal.judul}</div>
            </div>
            
            <div className="modal-detail-row">
              <div className="modal-detail-group">
                <label>Ketua Tim</label>
                <div className="modal-detail-value">{selectedProposal.ketua}</div>
              </div>
              <div className="modal-detail-group">
                <label>Instansi / Universitas</label>
                <div className="modal-detail-value">{selectedProposal.instansi}</div>
              </div>
            </div>

            <div className="modal-detail-row">
              <div className="modal-detail-group">
                <label>Email Ketua</label>
                <div className="modal-detail-value">{selectedProposal.email}</div>
              </div>
              <div className="modal-detail-group">
                <label>Nomor WhatsApp</label>
                <div className="modal-detail-value">{selectedProposal.whatsapp}</div>
              </div>
            </div>

            <div className="modal-detail-row">
              <div className="modal-detail-group">
                <label>Tanggal Pengajuan</label>
                <div className="modal-detail-value">{selectedProposal.tanggal}</div>
              </div>
              <div className="modal-detail-group">
                <label>Status Saat Ini</label>
                <div className="modal-detail-value">
                  <span className={`proposal-status ${getStatusClass(selectedProposal.status)}`}>
                    {selectedProposal.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-detail-group">
              <label>Deskripsi Singkat</label>
              <div className="modal-detail-value deskripsi-box">{selectedProposal.deskripsi}</div>
            </div>

            <div className="modal-detail-group">
              <label>Dokumen Lampiran</label>
              {selectedProposal.file_url ? (
                <a 
                  href={selectedProposal.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-download-large"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                >
                  <IoDocumentText /> Unduh / Lihat Dokumen Proposal
                </a>
              ) : (
                <div className="modal-detail-value" style={{ color: '#888', fontStyle: 'italic' }}>
                  Tidak ada file lampiran.
                </div>
              )}
            </div>

            {selectedProposal.status === 'Ditolak' && selectedProposal.alasan_tolak && (
              <div className="modal-detail-group reject-reason-group">
                <label>Alasan Penolakan</label>
                <div className="modal-detail-value reject-reason-box">
                  {selectedProposal.alasan_tolak}
                </div>
              </div>
            )}

            <div className="modal-actions">
              {confirmAction === 'alasan_tolak' ? (
                <div className="confirm-action-box">
                  <p style={{ marginBottom: '8px' }}>Silakan tuliskan <strong>alasan penolakan</strong> untuk proposal ini:</p>
                  <textarea 
                    className="reject-reason-input"
                    placeholder="Contoh: Topik proposal tidak sesuai dengan fokus program tahun ini..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="confirm-action-buttons" style={{ marginTop: '10px' }}>
                    <button className="btn-modal-action btn-batal" onClick={() => { setConfirmAction(null); setRejectReason(''); }}>Batal</button>
                    <button 
                      className="btn-modal-action btn-tolak"
                      disabled={!rejectReason.trim()}
                      style={{ opacity: !rejectReason.trim() ? 0.5 : 1 }}
                      onClick={() => handleUpdateStatus('Ditolak', rejectReason)}
                    >
                      Kirim Penolakan
                    </button>
                  </div>
                </div>
              ) : confirmAction ? (
                <div className="confirm-action-box">
                  <p>Apakah Anda yakin ingin <strong>{confirmAction === 'terima' ? 'menerima' : 'menolak'}</strong> proposal ini?</p>
                  <div className="confirm-action-buttons">
                    <button className="btn-modal-action btn-batal" onClick={() => setConfirmAction(null)}>Batal</button>
                    <button 
                      className={`btn-modal-action ${confirmAction === 'terima' ? 'btn-terima' : 'btn-tolak'}`} 
                      onClick={() => {
                        if (confirmAction === 'tolak') {
                          setConfirmAction('alasan_tolak');
                        } else {
                          handleUpdateStatus('Diterima');
                        }
                      }}
                    >
                      Ya, {confirmAction === 'terima' ? 'Terima' : 'Lanjut Tolak'}
                    </button>
                  </div>
                </div>
              ) : selectedProposal.status === 'Menunggu Review' ? (
                <>
                  <button className="btn-modal-action btn-terima" onClick={() => setConfirmAction('terima')}>Terima Proposal</button>
                  <button className="btn-modal-action btn-tolak" onClick={() => setConfirmAction('tolak')}>Tolak Proposal</button>
                </>
              ) : (
                <div style={{ flex: 1, textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                  Tidak ada aksi lanjutan untuk proposal ini.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />

      {/* Lock Confirmation Modal */}
      {showLockConfirm && (
        <div className="modal-overlay" onClick={() => setShowLockConfirm(false)}>
          <div className="modal-content confirm-lock-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <h2 style={{ color: '#c6000f', marginBottom: '15px' }}>
              <IoWarningOutline style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Konfirmasi Kunci Finalisasi
            </h2>
            <p style={{ color: '#333', marginBottom: '15px', lineHeight: '1.5' }}>
              Anda akan menetapkan <strong>{finalisasiSelections.length} proposal</strong> sebagai penerima pendanaan.
            </p>
            <div style={{ background: '#fdf5f5', border: '1px solid #f8d7da', padding: '12px', borderRadius: '8px', color: '#c6000f', marginBottom: '20px' }}>
              <strong>Perhatian:</strong> Tindakan ini bersifat permanen. Setelah dikunci, status penerima tidak dapat diubah lagi.
            </div>
            
            <p style={{ marginBottom: '10px', fontWeight: '500' }}>
              Ketik <strong>Kunci Finalisasi Penerima</strong> untuk melanjutkan:
            </p>
            <input 
              type="text" 
              value={lockConfirmText}
              onChange={(e) => setLockConfirmText(e.target.value)}
              placeholder="Ketik kalimat di atas..."
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '20px' }}
            />
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-batal"
                style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                onClick={() => { setShowLockConfirm(false); setLockConfirmText(''); }}
              >
                Batal
              </button>
              <button 
                className="btn-kunci-finalisasi"
                disabled={lockConfirmText !== 'Kunci Finalisasi Penerima' || isFinalisasiSubmitting}
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  background: lockConfirmText === 'Kunci Finalisasi Penerima' ? '#c6000f' : '#ccc',
                  color: '#fff',
                  cursor: lockConfirmText === 'Kunci Finalisasi Penerima' ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold'
                }}
                onClick={handleExecuteLockFinalisasi}
              >
                {isFinalisasiSubmitting ? 'Memproses...' : 'Kunci Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
