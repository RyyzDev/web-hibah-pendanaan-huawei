import React, { useState } from 'react';

interface ScopeItem {
  id: number;
  title: string;
  problem: string;
  technology: string;
}

const scopes: ScopeItem[] = [
  { id: 1, title: 'Smart Government', problem: 'Layanan administrasi lambat, data tidak terintegrasi, monitoring program belum berbasis dashboard.', technology: 'Huawei Cloud, database, dashboard, API, AI analytics.' },
  { id: 2, title: 'Smart Village / Smart Community', problem: 'Pendataan warga, UMKM, bantuan sosial, atau potensi desa belum terdigitalisasi.', technology: 'Cloud application, mobile/web app, data analytics.' },
  { id: 3, title: 'Pendidikan dan Literasi Digital', problem: 'Kesulitan monitoring pembelajaran, pelatihan digital, atau layanan akademik komunitas.', technology: 'Huawei Cloud, AI assistant, LMS integration, analytics.' },
  { id: 4, title: 'Kesehatan dan Layanan Sosial', problem: 'Pendataan layanan posyandu, stunting, lansia, atau disabilitas belum efektif.', technology: 'Cloud data platform, AI classification, IoT gateway bila relevan.' },
  { id: 5, title: 'UMKM dan Ekonomi Lokal', problem: 'UMKM kesulitan promosi, manajemen data pelanggan, stok, atau analitik penjualan.', technology: 'Cloud app, AI recommendation, data dashboard.' },
  { id: 6, title: 'Lingkungan dan Kebencanaan', problem: 'Pengawasan sampah, banjir, cuaca lokal, atau risiko lingkungan masih manual.', technology: 'IoT, cloud storage, AI detection, visual dashboard.' },
  { id: 7, title: 'Smart Farming', problem: 'Prediksi panen, masalah pendeteksi hama, dataset pertumbuhan tanaman.', technology: 'IoT, cloud storage, AI detection, visual dashboard.' },
];

const Programs: React.FC = () => {
  const [selectedScope, setSelectedScope] = useState<ScopeItem | null>(null);

  return (
    <section id="programs" className="section programs-section">
      <h2 className="section-title">Ruang Lingkup Project</h2>
      
      <div className="programs-intro">
        <p>
          Project yang diusulkan harus berbasis kebutuhan nyata dari mitra pengguna dan menggunakan platform atau teknologi Huawei sebagai komponen utama atau komponen pendukung yang signifikan. Ruang lingkup project dapat mencakup, tetapi tidak terbatas pada:
        </p>
      </div>

      <div className="scopes-grid">
        {scopes.map(scope => (
          <div key={scope.id} className="scope-card" onClick={() => setSelectedScope(scope)}>
            <h3>{scope.title}</h3>
            <span className="scope-icon">&rarr;</span>
          </div>
        ))}
      </div>

      {selectedScope && (
        <div className="modal-overlay" onClick={() => setSelectedScope(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedScope(null)}>&times;</button>
            <h3>{selectedScope.title}</h3>
            <div className="modal-body">
              <div className="modal-section">
                <h4>Persoalan</h4>
                <p>{selectedScope.problem}</p>
              </div>
              <div className="modal-section">
                <h4>Teknologi & Solusi</h4>
                <p>{selectedScope.technology}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Programs;
