import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { IoDocumentText, IoRibbon } from 'react-icons/io5';
import * as XLSX from 'xlsx-js-style';
import { supabase } from '../utils/supabase';
import Popup, { type PopupType } from '../components/Popup';
import './Dashboard.css';

import type { Proposal } from '../types/proposal';
import Sidebar from '../components/Dashboard/Sidebar';
import DashboardStats from '../components/Dashboard/DashboardStats';
import DashboardCharts from '../components/Dashboard/DashboardCharts';
import ProposalList from '../components/Dashboard/ProposalList';
import FinalisasiSection from '../components/Dashboard/FinalisasiSection';
import ProposalModal from '../components/Dashboard/ProposalModal';

const sidebarItems = [
  { key: 'dashboard', icon: MdDashboard, label: 'Dashboard' },
  { 
    key: 'riwayat', icon: IoDocumentText, label: 'Proposal',
    children: [
      { key: 'riwayat_semua', label: 'Semua Proposal' },
      { key: 'riwayat_menunggu', label: 'Menunggu Review' },
      { key: 'riwayat_diterima', label: 'Diterima' },
      { key: 'riwayat_ditolak', label: 'Ditolak' }
    ]
  },
  { key: 'finalisasi', icon: IoRibbon, label: 'Finalisasi Penerima' }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['riwayat']);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [confirmAction, setConfirmAction] = useState<'terima' | 'tolak' | 'alasan_tolak' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [finalisasiSelections, setFinalisasiSelections] = useState<string[]>([]);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalisasiSubmitting, setIsFinalisasiSubmitting] = useState(false);
  
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    type: PopupType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }

    // Apply dashboard specific styles
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
      } else {
        setSidebarOpen(true);
        setMobileOpen(false);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedData: Proposal[] = data.map((item: any) => ({
          ...item,
          ketua: item.nama_lengkap,
          tanggal: new Date(item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }));
        setProposals(mappedData);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProposals();
  }, []);

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Menunggu Review': return 'menunggu';
      case 'Diterima': return 'diterima';
      case 'Didanai': return 'didanai';
      case 'Ditolak': return 'ditolak';
      default: return '';
    }
  };

  const handleStatusAction = async (id: string, action: 'terima' | 'tolak') => {
    setIsSubmitting(true);
    const adminUser = localStorage.getItem('adminUser');
    const adminPass = localStorage.getItem('adminPass');

    const newStatus = action === 'terima' ? 'Diterima' : 'Ditolak';
    const finalAlasan = action === 'tolak' ? rejectReason : null;

    try {
      const { error } = await supabase.rpc('admin_update_proposal', {
        admin_usr: adminUser,
        admin_pwd: adminPass,
        p_id: id,
        new_status: newStatus,
        new_alasan: finalAlasan
      });

      if (error) throw error;
      
      setPopup({ isOpen: true, type: 'success', title: 'Berhasil', message: `Status proposal berhasil diubah menjadi ${newStatus}.`});
      fetchProposals();
      setSelectedProposal(null);
      setConfirmAction(null);
      setRejectReason('');
    } catch (err: unknown) {
      setPopup({ isOpen: true, type: 'error', title: 'Gagal', message: 'Gagal mengubah status: ' + (err as Error).message});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectFinalisasi = (id: string) => {
    setFinalisasiSelections(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 10) return prev;
      return [...prev, id];
    });
  };

  const handleSubmitFinalisasi = async () => {
    if (finalisasiSelections.length === 0) return;
    setIsFinalisasiSubmitting(true);
    const adminUser = localStorage.getItem('adminUser');
    const adminPass = localStorage.getItem('adminPass');

    try {
      const { error } = await supabase.rpc('admin_update_multiple_proposals', {
        admin_usr: adminUser,
        admin_pwd: adminPass,
        p_ids: finalisasiSelections,
        new_status: 'Didanai'
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

  let filteredProposals = proposals.filter(p => {
    if (activeTab === 'riwayat_menunggu') return p.status === 'Menunggu Review';
    if (activeTab === 'riwayat_diterima') return p.status === 'Diterima';
    if (activeTab === 'riwayat_ditolak') return p.status === 'Ditolak';
    return true; // dashboard, riwayat, riwayat_semua
  });

  if (activeTab === 'dashboard') {
    filteredProposals = filteredProposals.slice(0, 3);
  }

  const exportToExcel = () => {
    if (filteredProposals.length === 0) {
      setPopup({ isOpen: true, type: 'error', title: 'Data Kosong', message: 'Tidak ada data proposal untuk diekspor pada filter ini.' });
      return;
    }

    const exportData = filteredProposals.map((p, index) => ({
      No: index + 1,
      Judul: p.judul,
      'Ketua Tim': p.nama_lengkap,
      Instansi: p.instansi,
      Email: p.email,
      WhatsApp: p.whatsapp,
      Kategori: p.kategori,
      Status: p.status,
      'Alasan Penolakan': p.alasan_tolak || '-',
      'Tanggal Pengajuan': p.tanggal,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Style the header row (Row 0)
    const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1:J1");
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        fill: { fgColor: { rgb: "C6000F" } }, // Red background
        font: { color: { rgb: "FFFFFF" }, bold: true }, // White text, bold
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }

    // Set auto-width for columns
    worksheet['!cols'] = [
      { wch: 5 },   // A: No
      { wch: 50 },  // B: Judul
      { wch: 25 },  // C: Ketua Tim
      { wch: 30 },  // D: Instansi
      { wch: 30 },  // E: Email
      { wch: 20 },  // F: WhatsApp
      { wch: 20 },  // G: Kategori
      { wch: 15 },  // H: Status
      { wch: 40 },  // I: Alasan Penolakan
      { wch: 20 },  // J: Tanggal Pengajuan
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Proposal");
    XLSX.writeFile(workbook, `Data_Proposal_Huawei_${activeTab}.xlsx`);
  };

  const handleNavClick = (key: string, hasChildren: boolean) => {
    if (hasChildren) {
      setExpandedKeys(prev => 
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
      if (!sidebarOpen && !isMobile) {
        setSidebarOpen(true);
      }
    } else {
      setActiveTab(key);
      if (isMobile) setMobileOpen(false);
    }
  };

  // Compute dynamic stats
  const totalProposal = proposals.length;
  const menungguReview = proposals.filter(p => p.status === 'Menunggu Review').length;
  const diterima = proposals.filter(p => p.status === 'Diterima').length;
  const ditolak = proposals.filter(p => p.status === 'Ditolak').length;

  return (
    <div className="dashboard-layout">
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        sidebarOpen={sidebarOpen}
        handleToggleSidebar={handleToggleSidebar}
        handleCloseMobileOverlay={handleCloseMobileOverlay}
        handleLogout={handleLogout}
        sidebarItems={sidebarItems}
        expandedKeys={expandedKeys}
        activeTab={activeTab}
        handleNavClick={handleNavClick}
      />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dashboard Admin</h1>
          <p>Selamat datang di panel administrasi proposal pendanaan Huawei.</p>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <DashboardStats 
              totalProposal={totalProposal}
              menungguReview={menungguReview}
              diterima={diterima}
              ditolak={ditolak}
            />
            <DashboardCharts 
              menungguReview={menungguReview}
              diterima={diterima}
              ditolak={ditolak}
            />
          </>
        )}

        {(activeTab.startsWith('riwayat') || activeTab === 'dashboard') && (
          <ProposalList 
            activeTab={activeTab}
            filteredProposals={filteredProposals}
            getStatusClass={getStatusClass}
            setSelectedProposal={setSelectedProposal}
            exportToExcel={exportToExcel}
          />
        )}

        {activeTab === 'finalisasi' && (
          <FinalisasiSection 
            proposals={proposals}
            setSelectedProposal={setSelectedProposal}
            finalisasiSelections={finalisasiSelections}
            handleSelectFinalisasi={handleSelectFinalisasi}
            handleSubmitFinalisasi={handleSubmitFinalisasi}
            isFinalisasiSubmitting={isFinalisasiSubmitting}
            showLockConfirm={showLockConfirm}
            setShowLockConfirm={setShowLockConfirm}
          />
        )}
      </main>

      <ProposalModal 
        selectedProposal={selectedProposal}
        setSelectedProposal={setSelectedProposal}
        getStatusClass={getStatusClass}
        handleStatusAction={handleStatusAction}
        confirmAction={confirmAction}
        setConfirmAction={setConfirmAction}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        isSubmitting={isSubmitting}
      />

      <Popup 
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default Dashboard;
