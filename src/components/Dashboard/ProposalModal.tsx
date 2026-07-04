import React from 'react';
import { IoClose, IoCloudDownloadOutline, IoWarningOutline } from 'react-icons/io5';
import type { Proposal } from '../../types/proposal';

interface ProposalModalProps {
  selectedProposal: Proposal | null;
  setSelectedProposal: (proposal: Proposal | null) => void;
  getStatusClass: (status: string) => string;
  handleStatusAction: (id: string, action: 'terima' | 'tolak') => void;
  confirmAction: 'terima' | 'tolak' | 'alasan_tolak' | null;
  setConfirmAction: (action: 'terima' | 'tolak' | 'alasan_tolak' | null) => void;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
  isSubmitting: boolean;
}

const ProposalModal: React.FC<ProposalModalProps> = ({
  selectedProposal,
  setSelectedProposal,
  getStatusClass,
  handleStatusAction,
  confirmAction,
  setConfirmAction,
  rejectReason,
  setRejectReason,
  isSubmitting
}) => {
  if (!selectedProposal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={() => {
          setSelectedProposal(null);
          setConfirmAction(null);
          setRejectReason('');
        }}>
          <IoClose />
        </button>
        <h2 className="modal-title">Detail Proposal</h2>
        <div className="modal-body">
          <div className="modal-detail-row">
            <div className="modal-detail-group">
              <label>Ketua Tim</label>
              <div className="modal-detail-value">{selectedProposal.nama_lengkap}</div>
            </div>
            <div className="modal-detail-group">
              <label>Instansi</label>
              <div className="modal-detail-value">{selectedProposal.instansi}</div>
            </div>
          </div>
          <div className="modal-detail-row">
            <div className="modal-detail-group">
              <label>Email</label>
              <div className="modal-detail-value">{selectedProposal.email}</div>
            </div>
            <div className="modal-detail-group">
              <label>WhatsApp</label>
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
              <span className={`proposal-status ${getStatusClass(selectedProposal.status)}`}>
                {selectedProposal.status}
              </span>
            </div>
          </div>
          <div className="modal-detail-group">
            <label>Judul Inovasi</label>
            <div className="modal-detail-value">{selectedProposal.judul}</div>
          </div>
          <div className="modal-detail-group">
            <label>Ringkasan Inovasi / Deskripsi</label>
            <div className="modal-detail-value deskripsi-box">{selectedProposal.deskripsi}</div>
          </div>
          <div className="modal-detail-group" style={{ marginTop: '20px' }}>
            <label>Berkas Proposal</label>
            {selectedProposal.file_url ? (
              <a 
                href={selectedProposal.file_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-download-large"
              >
                <IoCloudDownloadOutline /> Unduh Dokumen Proposal
              </a>
            ) : (
              <div className="modal-detail-value" style={{ color: '#888', fontStyle: 'italic' }}>
                <IoWarningOutline /> File tidak tersedia
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

          {selectedProposal.status === 'Menunggu Review' && (
            <div className="modal-actions">
              {!confirmAction ? (
                <>
                  <button className="btn-modal-action btn-terima" onClick={() => setConfirmAction('terima')}>Terima Proposal</button>
                  <button className="btn-modal-action btn-tolak" onClick={() => setConfirmAction('alasan_tolak')}>Tolak Proposal</button>
                </>
              ) : confirmAction === 'alasan_tolak' ? (
                <div className="confirm-action-box" style={{ flex: 1 }}>
                  <p><strong>Alasan Penolakan:</strong></p>
                  <textarea 
                    className="reject-reason-input"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Masukkan alasan mengapa proposal ini ditolak..."
                    disabled={isSubmitting}
                  />
                  <div className="confirm-action-buttons">
                    <button className="btn-modal-action btn-batal" onClick={() => {
                      setConfirmAction(null);
                      setRejectReason('');
                    }} disabled={isSubmitting}>Batal</button>
                    <button className="btn-modal-action btn-tolak" onClick={() => handleStatusAction(selectedProposal.id, 'tolak')} disabled={isSubmitting || !rejectReason.trim()}>
                      {isSubmitting ? 'Memproses...' : 'Konfirmasi Tolak'}
                    </button>
                  </div>
                </div>
              ) : confirmAction === 'terima' ? (
                <div className="confirm-action-box" style={{ flex: 1 }}>
                  <p>Anda yakin ingin <strong>Menerima</strong> proposal ini?</p>
                  <div className="confirm-action-buttons">
                    <button className="btn-modal-action btn-batal" onClick={() => setConfirmAction(null)} disabled={isSubmitting}>Batal</button>
                    <button className="btn-modal-action btn-terima" onClick={() => handleStatusAction(selectedProposal.id, 'terima')} disabled={isSubmitting}>
                      {isSubmitting ? 'Memproses...' : 'Ya, Terima'}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;
