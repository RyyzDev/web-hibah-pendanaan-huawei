import React from 'react';
import { IoTrophyOutline, IoCashOutline, IoHourglassOutline, IoPeopleOutline, IoCloudOutline, IoDocumentTextOutline } from 'react-icons/io5';

const benefitData = [
  { id: 2, component: 'Jumlah Project Didanai', detail: '10 Judul Project Terpilih.', icon: <IoTrophyOutline /> },
  { id: 3, component: 'Besaran Dana', detail: 'Maksimal Rp20.000.000 per judul project.', icon: <IoCashOutline /> },
  { id: 4, component: 'Durasi Pelaksanaan', detail: 'Juli-September 2026', icon: <IoHourglassOutline /> },
  { id: 5, component: 'Bentuk Kegiatan', detail: 'Project berbasis masalah nyata yang melibatkan dosen, 10 mahasiswa, dan mitra pengguna.', icon: <IoPeopleOutline /> },
  { id: 6, component: 'Kewajiban Teknologi', detail: 'Menggunakan platform atau teknologi Huawei, seperti Huawei Cloud, Huawei AI, atau teknologi Huawei lain yang relevan.', icon: <IoCloudOutline /> },
  { id: 7, component: 'Luaran Wajib', detail: 'Laporan kegiatan, publikasi minimal SINTA 4, dan HKI.', icon: <IoDocumentTextOutline /> },
];

const Benefit: React.FC = () => {
  return (
    <section id="benefit" className="section benefit-section">
      <h2 className="section-title">Ketentuan</h2>
      
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
