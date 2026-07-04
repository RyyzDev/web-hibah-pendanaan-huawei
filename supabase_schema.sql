-- 1. Buat tabel 'proposals'
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lengkap TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    instansi TEXT NOT NULL,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    file_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Menunggu Review',
    alasan_tolak TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Aktifkan RLS (Row Level Security) pada tabel proposals
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- 3. Buat kebijakan (policy) RLS untuk proposals
-- Izinkan siapapun untuk mengirimkan proposal (Insert)
CREATE POLICY "Enable insert for all users" 
ON proposals FOR INSERT 
TO public 
WITH CHECK (true);

-- Izinkan siapapun untuk membaca proposal (Select)
CREATE POLICY "Enable read for all users" 
ON proposals FOR SELECT 
TO public 
USING (true);

-- Izinkan admin/publik untuk memperbarui proposal (Update)
CREATE POLICY "Enable update for all users" 
ON proposals FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);

-- 4. Konfigurasi Storage Bucket 'proposal_documents'
-- Pastikan bucket dibuat (jika belum ada)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proposal_documents', 'proposal_documents', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Buat kebijakan (policy) RLS untuk Storage
-- Izinkan siapapun mengunggah file ke bucket 'proposal_documents'
CREATE POLICY "Enable upload for all users" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'proposal_documents');

-- Izinkan siapapun untuk membaca (mengunduh) file dari bucket tersebut
CREATE POLICY "Enable read for all users" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'proposal_documents');
