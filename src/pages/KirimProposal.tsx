import React, { useState, useEffect, useRef, DragEvent, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoPersonOutline, IoSchoolOutline, IoDocumentTextOutline, IoCheckboxOutline, IoCloudUploadOutline, IoCloseCircle, IoSendSharp, IoWarningOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import Navbar from '../components/Navbar';
import { supabase } from '../utils/supabase';
import './KirimProposal.css';

const KATEGORI_OPTIONS = [
  'Smart Government',
  'Smart Village / Smart Community',
  'Pendidikan dan Literasi Digital',
  'Kesehatan dan Layanan Sosial',
  'UMKM dan Ekonomi Lokal',
  'Lingkungan dan Kebencanaan',
  'Smart Farming',
];

const MAX_DESC_CHARS = 500;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx';

interface FormData {
  judul: string;
  ketuaTim: string;
  email: string;
  whatsapp: string;
  instansi: string;
  kategori: string;
  deskripsi: string;
}

const initialFormData: FormData = {
  judul: '',
  ketuaTim: '',
  email: '',
  whatsapp: '',
  instansi: '',
  kategori: '',
  deskripsi: '',
};

const KirimProposal: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState({
    kebijakan: false,
    originalitas: false,
    sanksi: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allAgreed = agreements.kebijakan && agreements.originalitas && agreements.sanksi;
  const isFormFilled = Object.values(formData).every((val) => val.trim() !== '') && file !== null;
  const isSubmitDisabled = !allAgreed || isSubmitting || !isFormFilled;

  useEffect(() => {
    document.body.classList.add('kirim-proposal-page');
    return () => {
      document.body.classList.remove('kirim-proposal-page');
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'deskripsi' && value.length > MAX_DESC_CHARS) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = (f: File): boolean => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      alert('Format file tidak didukung. Harap unggah file .pdf, .doc, atau .docx.');
      return false;
    }
    if (f.size > MAX_FILE_SIZE) {
      alert('Ukuran file melebihi 20MB. Harap unggah file yang lebih kecil.');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && validateFile(selected)) {
      setFile(selected);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && validateFile(dropped)) {
      setFile(dropped);
    }
  };

  const removeFile = () => setFile(null);

  const handleAgreementChange = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!allAgreed) return;
    
    setIsSubmitting(true);
    
    try {
      let fileUrl = '';
      
      // Upload file to Supabase Storage if file exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `proposals/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('proposal_documents')
          .upload(filePath, file);
          
        if (uploadError) {
          throw new Error(`Gagal mengunggah file: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('proposal_documents')
          .getPublicUrl(filePath);
          
        fileUrl = publicUrlData.publicUrl;
      }
      
      // Insert to proposals table
      const { error: insertError } = await supabase
        .from('proposals')
        .insert([
          {
            nama_lengkap: formData.ketuaTim,
            email: formData.email,
            whatsapp: formData.whatsapp,
            instansi: formData.instansi,
            judul: formData.judul,
            kategori: formData.kategori,
            deskripsi: formData.deskripsi,
            file_url: fileUrl,
            status: 'Menunggu Review'
          }
        ]);
        
      if (insertError) {
        throw new Error(`Gagal mengirim proposal: ${insertError.message}`);
      }
      
      
      setShowSuccessPopup(true);
      setFormData(initialFormData);
      setFile(null);
      setAgreements({ kebijakan: false, originalitas: false, sanksi: false });
    } catch (error: unknown) {
      alert((error as Error).message || 'Terjadi kesalahan saat mengirim proposal.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="kirim-proposal-container">
        <div className="kirim-proposal-card">
          <Link to="/" className="kirim-proposal-back">
            <IoArrowBack /> Kembali ke Beranda
          </Link>
          
          <h1 className="kirim-proposal-title">Kirim Proposal</h1>
          <p className="kirim-proposal-subtitle">Lengkapi formulir di bawah ini untuk mengajukan proposal pendanaan.</p>

          <form onSubmit={handleSubmit}>
            {/* Section: Informasi Pribadi */}
            <div className="form-section-header">
              <IoPersonOutline className="section-icon" />
              <span className="section-label">Informasi Pribadi</span>
            </div>
            
            <div className="kirim-proposal-form-group">
              <label htmlFor="ketuaTim">Nama Ketua Tim <span className="required-star">*</span></label>
              <input
                id="ketuaTim"
                name="ketuaTim"
                type="text"
                required
                value={formData.ketuaTim}
                onChange={handleChange}
                placeholder="Masukkan nama ketua tim"
              />
            </div>
            <div className="kirim-proposal-form-group">
              <label htmlFor="email">Email <span className="required-star">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
              />
            </div>
            <div className="kirim-proposal-form-group">
              <label htmlFor="whatsapp">Nomor WhatsApp <span className="required-star">*</span></label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Section: Informasi Akademik */}
            <div className="form-section-header">
              <IoSchoolOutline className="section-icon" />
              <span className="section-label">Informasi Akademik</span>
            </div>
            <div className="kirim-proposal-form-group">
              <label htmlFor="instansi">Instansi / Universitas <span className="required-star">*</span></label>
              <input
                id="instansi"
                name="instansi"
                type="text"
                required
                value={formData.instansi}
                onChange={handleChange}
                placeholder="Nama instansi atau universitas"
              />
            </div>

            {/* Section: Detail Proposal */}
            <div className="form-section-header">
              <IoDocumentTextOutline className="section-icon" />
              <span className="section-label">Detail Proposal</span>
            </div>
            <div className="kirim-proposal-form-group">
              <label htmlFor="judul">Judul Proposal <span className="required-star">*</span></label>
              <input
                id="judul"
                name="judul"
                type="text"
                required
                value={formData.judul}
                onChange={handleChange}
                placeholder="Masukkan judul proposal"
              />
            </div>
            <div className="kirim-proposal-form-group">
              <label htmlFor="kategori">Kategori Proposal <span className="required-star">*</span></label>
              <select
                id="kategori"
                name="kategori"
                required
                value={formData.kategori}
                onChange={handleChange}
              >
                <option value="" disabled>-- Pilih Kategori --</option>
                {KATEGORI_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="kirim-proposal-form-group">
              <label htmlFor="deskripsi">Deskripsi Singkat Proposal <span className="required-star">*</span></label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                required
                maxLength={MAX_DESC_CHARS}
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Jelaskan secara singkat tentang proposal Anda..."
              />
              <div className="kirim-proposal-char-count">
                {formData.deskripsi.length}/{MAX_DESC_CHARS}
              </div>
            </div>
            <div className="kirim-proposal-form-group">
              <label>Upload Dokumen Proposal <span className="required-star">*</span></label>
              {!file ? (
                <div
                  className={`kirim-proposal-dropzone${dragActive ? ' drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="kirim-proposal-dropzone-icon">
                    <IoCloudUploadOutline />
                  </div>
                  <p className="kirim-proposal-dropzone-text">
                    Seret & lepas file di sini, atau <span>klik untuk memilih</span>
                  </p>
                  <p className="kirim-proposal-dropzone-hint">
                    Format: .pdf, .doc, .docx &bull; Maks. 20MB
                  </p>
                  <div className="kirim-proposal-dropzone-note">
                    <IoWarningOutline className="note-icon" />
                    <span>
                      <strong>Penting:</strong> Pastikan Anda telah melampirkan <em>Sertifikat Completion</em> dari peserta/mahasiswa, dokumen <em>Rencana Anggaran Biaya (RAB)</em>, serta <em>Surat Mitra</em> di dalam file proposal ini.
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="kirim-proposal-file-info">
                  <IoDocumentTextOutline className="file-icon" />
                  <span className="file-name">{file.name}</span>
                  <button type="button" className="remove-file" onClick={removeFile}>
                    <IoCloseCircle />
                  </button>
                </div>
              )}
            </div>

            {/* Section: Persetujuan */}
            <div className="form-section-header">
              <IoCheckboxOutline className="section-icon" />
              <span className="section-label">Persetujuan</span>
            </div>
            <div className="agreement-group">
              <div 
                className={`agreement-item ${agreements.kebijakan ? 'checked' : ''}`}
                onClick={() => handleAgreementChange('kebijakan')}
              >
                <input 
                  type="checkbox" 
                  checked={agreements.kebijakan} 
                  readOnly 
                />
                <span className="agreement-text">
                  Saya menyetujui seluruh kebijakan, peraturan, dan ketentuan yang berlaku dalam Program Hibah Pendanaan Project Based Learning Huawei ICT Academy x APTIKOM, termasuk ketentuan penggunaan data dan hak kekayaan intelektual.
                </span>
              </div>
              
              <div 
                className={`agreement-item ${agreements.originalitas ? 'checked' : ''}`}
                onClick={() => handleAgreementChange('originalitas')}
              >
                <input 
                  type="checkbox" 
                  checked={agreements.originalitas} 
                  readOnly 
                />
                <span className="agreement-text">
                  Saya menyatakan bahwa proposal yang diajukan merupakan karya orisinal tim saya, belum pernah dipublikasikan, dan tidak sedang diajukan ke program pendanaan lain manapun.
                </span>
              </div>
              
              <div 
                className={`agreement-item ${agreements.sanksi ? 'checked' : ''}`}
                onClick={() => handleAgreementChange('sanksi')}
              >
                <input 
                  type="checkbox" 
                  checked={agreements.sanksi} 
                  readOnly 
                />
                <span className="agreement-text">
                  Saya memahami dan bersedia menerima segala konsekuensi dan sanksi yang ditetapkan panitia apabila di kemudian hari ditemukan pelanggaran terhadap aturan, ketentuan, maupun kode etik yang berlaku, termasuk pencabutan pendanaan dan diskualifikasi.
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className="kirim-proposal-submit-btn" 
              disabled={isSubmitDisabled}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Proposal'} <IoSendSharp />
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup-card">
            <IoCheckmarkCircleOutline className="success-popup-icon" />
            <h2 className="success-popup-title">Berhasil!</h2>
            <p className="success-popup-message">Proposal Anda telah berhasil dikirim dan akan segera direview oleh panitia Huawei ICT Academy.</p>
            <div className="success-popup-actions">
              <button 
                className="btn-success-close"
                onClick={() => {
                  setShowSuccessPopup(false);
                  navigate('/');
                }}
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KirimProposal;
