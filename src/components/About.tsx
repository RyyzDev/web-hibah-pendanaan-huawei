import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="section about-section">
      <h2 className="section-title">Tentang Program</h2>
      
      <div className="about-content-blended">
        <p className="about-text-blended">
          Program Hibah Pendanaan Project Based Learning Huawei Academy merupakan skema pendanaan project inovasi yang dirancang untuk memperkuat pembelajaran berbasis masalah nyata, mempertemukan kapasitas akademik kampus dengan kebutuhan masyarakat, serta mendorong pemanfaatan platform dan teknologi Huawei secara produktif.
        </p>
        <p className="about-text-blended">
          Melalui program ini, dosen dan mahasiswa didorong untuk menyelesaikan persoalan riil pada pemerintah daerah, organisasi kemasyarakatan, komunitas, atau unit layanan publik. Project yang dikembangkan tidak berhenti pada prototipe teknis, tetapi harus menghasilkan dampak terukur, dokumentasi kegiatan, publikasi ilmiah minimal SINTA 4, serta perlindungan kekayaan intelektual dalam bentuk HKI.
        </p>
        <p className="about-text-blended">
          Program ini juga menjadi wahana pembelajaran terapan bagi dosen dan mahasiswa yang telah mengikuti training pada platform Huawei Academy dan memiliki sertifikat completion. Dengan demikian, dosen dan mahasiswa tidak hanya memperoleh penguatan kompetensi teknis, tetapi juga pengalaman menyelesaikan masalah nyata bersama pemangku kepentingan.
        </p>
      </div>
    </section>
  );
};

export default About;
