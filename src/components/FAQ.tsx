import React, { useState } from 'react';
import './FAQ.css';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "Siapa saja yang bisa mengikuti Program Hibah Pendanaan PBL Huawei ICT Academy?",
    answer: "Program ini terbuka untuk seluruh mahasiswa, dosen, maupun anggota aktif Huawei ICT Academy di berbagai perguruan tinggi yang memiliki ide inovatif di bidang teknologi."
  },
  {
    question: "Bagaimana cara mendaftarkan proposal inovasi saya?",
    answer: "Anda dapat mendaftarkan proposal dengan menekan tombol 'Kirim Proposal' di halaman utama, kemudian mendaftar akun/login, lalu mengunggah dokumen proposal berformat PDF/DOC pada menu Dashboard."
  },
  {
    question: "Apakah ada batasan tema untuk proposal yang dikirimkan?",
    answer: "Tema diutamakan berfokus pada teknologi terdepan Huawei, seperti Cloud, AI, Big Data, Networking, atau IoT yang dapat memberikan solusi nyata bagi masyarakat, kampus, atau industri lokal."
  },
  {
    question: "Berapa maksimal ukuran file proposal yang dapat diunggah?",
    answer: "Ukuran maksimal file proposal yang dapat diunggah melalui dashboard peserta adalah 20MB. Pastikan file tidak dikunci dengan password agar memudahkan proses review."
  },
  {
    question: "Kapan batas akhir pengumpulan proposal?",
    answer: "Batas akhir pendaftaran dan pengumpulan proposal adalah tanggal 20 Juli 2026 pukul 23:59 WIB. Pastikan Anda mengunggahnya sebelum waktu hitung mundur (countdown) di halaman utama berakhir."
  },
  {
    question: "Dimana saya mengetahui proposal saya lulus atau tidak?",
    answer: (
      <>
        <a href="/pengumuman" style={{ color: '#ffaa77', textDecoration: 'underline' }}>Klik disini</a> untuk melihat pengumuman. Hasil juga akan dikirimkan via grup Whatsapp.
      </>
    )
  }
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <h2 className="section-title">Frequently Asked <span className="text-gradient">Questions</span></h2>
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
