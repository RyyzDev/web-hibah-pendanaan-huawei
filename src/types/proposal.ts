export interface Proposal {
  id: string;
  nama_lengkap: string;
  email: string;
  whatsapp: string;
  instansi: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  file_url?: string;
  status: string;
  alasan_tolak?: string;
  created_at: string;
  ketua?: string;
  tanggal?: string;
}
