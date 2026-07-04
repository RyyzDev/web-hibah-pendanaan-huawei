import React from 'react';
import { IoRibbon, IoDocumentText, IoLockClosed, IoWarning } from 'react-icons/io5';
import type { Proposal } from '../../types/proposal';

interface FinalisasiSectionProps {
  proposals: Proposal[];
  setSelectedProposal: (proposal: Proposal) => void;
  finalisasiSelections: string[];
  handleSelectFinalisasi: (id: string) => void;
  handleSubmitFinalisasi: (key: string) => void;
  isFinalisasiSubmitting: boolean;
  showLockConfirm: boolean;
  setShowLockConfirm: (show: boolean) => void;
}

const FinalisasiSection: React.FC<FinalisasiSectionProps> = ({
  proposals,
  setSelectedProposal,
  finalisasiSelections,
  handleSelectFinalisasi,
  handleSubmitFinalisasi,
  isFinalisasiSubmitting,
  showLockConfirm,
  setShowLockConfirm
}) => {
  const [finalisasiKey, setFinalisasiKey] = React.useState('');
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
                  <span className="proposal-status didanai">
                    <IoRibbon style={{ marginRight: '4px' }} /> Didanai
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="finalisasi-content">
          <div style={{ padding: '1rem', background: '#fff3cd', color: '#856404', borderRadius: '12px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <IoWarning /> Tahap Penetapan Akhir
            </strong>
            <p style={{ marginTop: '8px', marginBottom: 0 }}>Pilih maksimal 10 proposal dari daftar proposal yang telah berstatus "Diterima" di bawah ini. Setelah Anda menekan tombol "Kunci Finalisasi", status proposal yang dipilih akan berubah menjadi "Didanai" dan tindakan ini tidak dapat dibatalkan.</p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 600 }}>Terpilih: {finalisasiSelections.length} / 10</span>
            <button 
              className="btn-modal-action btn-terima"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: finalisasiSelections.length === 0 ? 0.5 : 1 }}
              disabled={finalisasiSelections.length === 0}
              onClick={() => setShowLockConfirm(true)}
            >
              <IoLockClosed /> Kunci Finalisasi ({finalisasiSelections.length})
            </button>
          </div>

          <div className="proposal-list">
            {diterimaProposals.length > 0 ? diterimaProposals.map((p) => (
              <div className="proposal-card" key={p.id} style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={finalisasiSelections.includes(p.id)}
                  onChange={() => handleSelectFinalisasi(p.id)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  disabled={!finalisasiSelections.includes(p.id) && finalisasiSelections.length >= 10}
                />
                <div className="proposal-doc-icon" style={{ marginLeft: '10px' }} onClick={() => setSelectedProposal(p)}><IoDocumentText /></div>
                <div className="proposal-info" onClick={() => setSelectedProposal(p)}>
                  <div className="proposal-title">{p.judul}</div>
                  <div className="proposal-meta">
                    {p.ketua} &middot; {p.instansi}
                  </div>
                </div>
                <div className="proposal-right" onClick={() => setSelectedProposal(p)}>
                  <span className="proposal-date">{p.tanggal}</span>
                  <span className="proposal-status diterima">Diterima</span>
                </div>
              </div>
            )) : (
              <div className="no-data">Belum ada proposal yang berstatus Diterima.</div>
            )}
          </div>
        </div>
      )}
      
      {showLockConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px 20px' }}>
            <IoWarning style={{ fontSize: '4rem', color: '#f59e0b', marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.3rem' }}>Konfirmasi Finalisasi</h3>
            <p style={{ color: '#555', marginBottom: '24px' }}>
              Anda akan mengunci <strong>{finalisasiSelections.length} proposal</strong> sebagai penerima pendanaan.
              Proposal yang tidak terpilih akan tetap berstatus "Diterima".<br/><br/>
              <strong>Tindakan ini permanen dan tidak dapat diubah kembali oleh Admin.</strong><br/>
              Untuk melanjutkan, ketik <br/> <strong>FINALISASI-PENERIMA-2026</strong> <br/>pada kolom di bawah ini:
            </p>
            <input 
              type="text" 
              placeholder="FINALISASI-PENERIMA-2026" 
              value={finalisasiKey}
              onChange={(e) => setFinalisasiKey(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-modal-action btn-batal" onClick={() => { setShowLockConfirm(false); setFinalisasiKey(''); }} disabled={isFinalisasiSubmitting}>Batal</button>
              <button 
                className="btn-modal-action btn-terima" 
                onClick={() => { handleSubmitFinalisasi(finalisasiKey); setFinalisasiKey(''); }} 
                disabled={isFinalisasiSubmitting || finalisasiKey !== 'FINALISASI-PENERIMA-2026'}
                style={{
                  cursor: (isFinalisasiSubmitting || finalisasiKey !== 'FINALISASI-PENERIMA-2026') ? 'not-allowed' : 'pointer',
                  opacity: (isFinalisasiSubmitting || finalisasiKey !== 'FINALISASI-PENERIMA-2026') ? 0.6 : 1
                }}
              >
                {isFinalisasiSubmitting ? 'Memproses...' : 'Ya, Kunci Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FinalisasiSection;
