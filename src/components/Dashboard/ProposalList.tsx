import React from 'react';
import { IoDocumentText, IoDownloadOutline } from 'react-icons/io5';
import type { Proposal } from '../../types/proposal';

interface ProposalListProps {
  activeTab: string;
  filteredProposals: Proposal[];
  getStatusClass: (status: string) => string;
  setSelectedProposal: (proposal: Proposal) => void;
  exportToExcel: () => void;
}

const ProposalList: React.FC<ProposalListProps> = ({
  activeTab,
  filteredProposals,
  getStatusClass,
  setSelectedProposal,
  exportToExcel
}) => {
  return (
    <section className="proposal-section">
      <div className="proposal-section-header">
        <h2 className="proposal-section-title">
          {activeTab === 'dashboard' ? 'Proposal Terbaru' :
           activeTab === 'riwayat_menunggu' ? 'Proposal Menunggu Diverifikasi' :
           activeTab === 'riwayat_diterima' ? 'Proposal Diterima' :
           activeTab === 'riwayat_ditolak' ? 'Proposal Ditolak' :
           'Riwayat Pengajuan Proposal'}
        </h2>
        {activeTab !== 'dashboard' && (
          <button onClick={exportToExcel} className="btn-export-excel">
            <IoDownloadOutline /> Export ke Excel
          </button>
        )}
      </div>
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
  );
};

export default ProposalList;
