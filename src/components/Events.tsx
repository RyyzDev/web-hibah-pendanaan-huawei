import React from 'react';

const eventsData = [
  { id: 1, title: 'Sosialisasi', date: '11 Juli 2026 (10.00-12.00 WIB)', desc: 'Pengumuman program, penjelasan juknis, dan sesi tanya jawab kepada calon pengusul.', output: 'Materi sosialisasi', icon: '📢' },
  { id: 2, title: 'Pendaftaran proposal', date: '11 Juli – 20 Juli 2026', desc: 'Tim mengunggah proposal, surat mitra, sertifikat completion mahasiswa, dan RAB.', output: 'Berkas proposal', icon: '📝' },
  { id: 3, title: 'Seleksi administrasi', date: '20 Juli – 24 Juli 2026', desc: 'Pemeriksaan kelengkapan dan kesesuaian persyaratan.', output: 'Daftar lolos administrasi', icon: '🔍' },
  { id: 4, title: 'Seleksi substansi', date: '24 Juli – 26 Juli 2026', desc: 'Penilaian proposal oleh reviewer berdasarkan rubrik.', output: 'Nilai reviewer', icon: '⚖️' },
  { id: 5, title: 'Presentasi proposal', date: '26 Juli 2026', desc: 'Tim mempresentasikan masalah mitra, solusi, teknologi Huawei, rencana kerja, dan luaran.', output: 'Berita acara seleksi', icon: '📽️' },
  { id: 6, title: 'Penetapan penerima', date: '30 Juli 2026', desc: 'Penetapan 10 judul project terpilih dan penandatanganan komitmen.', output: 'SK/Surat penetapan', icon: '🏆' },
  { id: 7, title: 'Pelaksanaan project', date: 'Agustus – September 2026', desc: 'Implementasi project bersama mahasiswa dan mitra pengguna.', output: 'Logbook dan dokumentasi', icon: '⚙️' },
  { id: 8, title: 'Seminar Hasil', date: '5 Oktober 2026', desc: 'Monev kemajuan, validasi luaran, dan evaluasi manfaat.', output: 'Laporan kemajuan/final', icon: '📊' }
];

const Events: React.FC = () => {
  return (
    <section id="events" className="section events-section">
      <h2 className="section-title">Jadwal & Tahapan Program</h2>
      
      <div className="snake-timeline">
        {/* Row 1 (1 to 4) */}
        <div className="snake-row row-right">
          {eventsData.slice(0, 4).map((event) => (
            <div key={event.id} className="snake-node">
              <div className="node-icon">{event.icon}</div>
              <div className="node-content">
                <span className="node-date">{event.date}</span>
                <h3 className="node-title">{event.title}</h3>
                <p className="node-desc">{event.desc}</p>
                <div className="node-output"><strong>Luaran:</strong> {event.output}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Row 2 (8 to 5) - Rendered in reverse (8, 7, 6, 5) to display Right to Left */}
        <div className="snake-row row-left">
          {eventsData.slice(4, 8).reverse().map((event) => (
            <div key={event.id} className="snake-node">
              <div className="node-icon">{event.icon}</div>
              <div className="node-content">
                <span className="node-date">{event.date}</span>
                <h3 className="node-title">{event.title}</h3>
                <p className="node-desc">{event.desc}</p>
                <div className="node-output"><strong>Luaran:</strong> {event.output}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
