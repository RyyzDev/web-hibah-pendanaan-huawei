-- Buat tabel 'admins'
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Izinkan public read sementara untuk verifikasi login dari client-side
-- PERINGATAN: Di lingkungan produksi sungguhan, gunakan Supabase Auth atau verifikasi via Edge Functions!
CREATE POLICY "Enable read for login" 
ON admins FOR SELECT 
TO public 
USING (true);

-- Masukkan data admin default
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');
