import React from 'react';

const benefitData = [
  { id: 2, component: 'Jumlah project didanai', detail: '10 judul project.', icon: '🏆' },
  { id: 3, component: 'Besaran dana', detail: 'Maksimal Rp20.000.000 per judul project.', icon: '💰' },
  { id: 4, component: 'Durasi pelaksanaan', detail: 'Juli-September 2026', icon: '⏳' },
  { id: 5, component: 'Bentuk kegiatan', detail: 'Project berbasis masalah nyata yang melibatkan dosen, 10 mahasiswa, dan mitra pengguna.', icon: '👥' },
  { id: 6, component: 'Kewajiban teknologi', detail: 'Menggunakan platform atau teknologi Huawei, seperti Huawei Cloud, Huawei AI, atau teknologi Huawei lain yang relevan.', icon: '☁️' },
  { id: 7, component: 'Luaran wajib', detail: 'Laporan kegiatan, publikasi minimal SINTA 4, dan HKI.', icon: '📑' },
];

const Benefit: React.FC = () => {
  return (
    <section id="benefit" className="section benefit-section">
      <h2 className="section-title">Ketentuan & Benefit Pendanaan</h2>
      
      <div className="benefit-container">
        {benefitData.map(item => (
          <div key={item.id} className="benefit-card">
            <div className="benefit-icon">{item.icon}</div>
            <div className="benefit-content">
              <h4>{item.component}</h4>
              <p>{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefit;
