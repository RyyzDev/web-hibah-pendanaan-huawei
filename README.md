# 🎓 Sistem Informasi Hibah Pendanaan PBL Huawei ICT Academy 2026

Sebuah aplikasi web modern berbasis React dan Supabase untuk mengelola alur pendaftaran, pelacakan, dan evaluasi proposal hibah pendanaan Project-Based Learning (PBL) dari Huawei.

![Hero Banner](https://img.shields.io/badge/Huawei-ICT_Academy-c6000f?style=for-the-badge&logo=huawei&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

---

## ✨ Fitur Utama

### 🧑‍🎓 Untuk Peserta (Pendaftar)
- **Beranda Interaktif**: Halaman depan (*Landing Page*) dinamis dengan *micro-animations*, FAQ, dan informasi program yang modern dan elegan.
- **Kirim Proposal**: Formulir pengajuan yang komprehensif, dilengkapi validasi *mandatory fields*, dan unggah *file* proposal (.pdf/.zip) langsung terintegrasi dengan **Supabase Storage**.
- **Cek Status Real-time**: Pendaftar dapat melacak status proposal mereka (Menunggu Review, Diterima, Ditolak, Didanai) beserta alasan penolakan secara *real-time* hanya dengan memasukkan alamat Email.
- **Pengumuman Terpusat**: Papan pengumuman publik yang secara otomatis menyoroti daftar tim pemenang (*Penerima Pendanaan*) dengan antarmuka yang mewah.
- **Notifikasi Kustom**: Seluruh dialog dan notifikasi menggunakan sistem *Pop-up* kustom modern, bebas dari interupsi *alert()* standar *browser*.

### 👨‍💼 Untuk Admin / Panitia Evaluator
- **Dashboard Analitik**: Menyediakan data visual berupa diagram *Bar* (tren pengajuan) dan *Pie* (persentase status) menggunakan `Chart.js`.
- **Manajemen Status Proposal**: Terima atau Tolak proposal. Jika menolak, admin wajib melampirkan "Alasan Penolakan".
- **Detail Proposal Lengkap**: Melihat metadata pendaftar (termasuk Email dan WhatsApp) serta mengunduh dokumen lampiran proposal hanya dengan satu klik.
- **Finalisasi Terkunci (Locked Finalization)**: Fitur khusus untuk menetapkan pemenang akhir ("Didanai"). Dilengkapi dengan *strict confirmation* (wajib mengetik ulang kalimat konfirmasi) untuk menghindari kesalahan fatal. Sekali terkunci, status menjadi permanen.
- **Sistem Keamanan Kelas Enterprise**: Menggunakan **Row Level Security (RLS)** pada *database* PostgreSQL. Pihak eksternal (maupun eksploitasi API) tidak dapat melakukan UPDATE atau DELETE pada tabel proposal. Seluruh aksi pembaruan oleh admin dijalankan melalui fungsi aman **Postgres RPC (Stored Procedures)** yang memvalidasi *username* dan *password* admin secara independen di tingkat *database*.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: React 18 (Vite)
- **Bahasa Pemrograman**: TypeScript
- **Styling**: Vanilla CSS (dengan CSS Variables, Flexbox/Grid, & Animations)
- **Routing**: React Router DOM v6
- **Database & Backend**: Supabase (PostgreSQL, Storage, RLS, RPCs)
- **Visualisasi Data**: Chart.js & React-Chartjs-2
- **Ikonografi**: React Icons (Ionicons 5)

---

## 📦 Panduan Instalasi & Persiapan

### 1. Kebutuhan Sistem
Pastikan komputer Anda sudah terinstal:
- [Node.js](https://nodejs.org/) (Versi 18+ direkomendasikan)
- [NPM](https://www.npmjs.com/) atau Yarn

### 2. Kloning Repositori
```bash
git clone https://github.com/username/proposal-huawei.git
cd proposal-huawei
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Supabase
Sistem ini sangat bergantung pada ekosistem Supabase. Anda wajib mengaturnya sebelum menjalankan aplikasi.

#### A. Buat Tabel Database
Buka menu **SQL Editor** di *dashboard* Supabase Anda, dan jalankan SQL berikut:
```sql
-- Tabel Proposal
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  instansi TEXT NOT NULL,
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  file_url TEXT,
  status TEXT DEFAULT 'Menunggu Review',
  alasan_tolak TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Admin
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Akun admin bawaan (Silakan diganti nanti)
INSERT INTO admins (username, password) VALUES ('admin', 'password123');
```

#### B. Setup Keamanan (RLS & RPC)
Buka dan *copy-paste* seluruh isi *file* `secure_admin.sql` yang ada di root repositori ini ke dalam Supabase SQL Editor, lalu jalankan. Hal ini akan mengunci tabel dari modifikasi ilegal dan membuat *Stored Procedures* untuk Admin.

#### C. Setup Storage (Bucket)
1. Ke menu **Storage** di Supabase.
2. Buat *bucket* baru dengan nama persis: `proposals`
3. Atur *bucket* ini menjadi **Public** agar file bisa diunduh oleh admin nantinya.

#### D. Variabel Lingkungan (.env)
Buat *file* bernama `.env` di *root* proyek (sejajar dengan `package.json`), lalu isi dengan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://[PROJECT-ID].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz... [Kunci Anon Publik Anda]
```

---

## 🚀 Cara Menjalankan Aplikasi

Jalankan *server* lokal untuk pengembangan:
```bash
npm run dev
```
Aplikasi akan terbuka secara otomatis di `http://localhost:5173`.

### Mengakses Dashboard Admin
Kunjungi: `http://localhost:5173/admin/login`
- **Username**: `admin`
- **Password**: `password123`

---

## 🔒 Arsitektur Keamanan (Database)

Aplikasi ini tidak menggunakan Supabase Auth konvensional untuk admin, melainkan menggunakan tabel kustom. Agar tabel `proposals` tidak bisa diubah (*update/delete*) oleh pengunjung publik secara iseng, aplikasi ini menggunakan:

1. **Row Level Security (RLS)**: Tabel `proposals` memiliki kebijakan yang HANYA membolehkan aksi `INSERT` dan `SELECT` untuk `anon` (publik). Kebijakan `UPDATE` dan `DELETE` **TIDAK ADA** (diblokir total).
2. **Security Definer RPC**: Saat Admin mengeklik "Terima", "Tolak", atau "Kunci Finalisasi", aplikasi React akan memanggil fungsi kustom (*RPC / Stored Procedures*) bernama `admin_update_proposal` dan `admin_update_multiple_proposals`.
3. **Database-level Validation**: Fungsi RPC tersebut akan meminta parameter *username* dan *password* milik admin, mencocokkannya ke tabel `admins`, dan jika cocok, ia akan mengabaikan RLS dan mengeksekusi *update*.

---

## 📄 Lisensi
Proyek ini dibuat untuk keperluan pengajuan internal dan evaluasi program PBL Huawei ICT Academy. Seluruh aset gambar dan properti merek tunduk pada hak cipta pihak terkait.
