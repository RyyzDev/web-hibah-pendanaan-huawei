-- Aktifkan RLS pada tabel proposals
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Izinkan semua orang (anon) untuk INSERT (Submit proposal)
CREATE POLICY "Allow public insert" ON proposals
  FOR INSERT TO public
  WITH CHECK (true);

-- Izinkan semua orang (anon) untuk SELECT (Melihat proposal di dashboard / pengumuman)
CREATE POLICY "Allow public select" ON proposals
  FOR SELECT TO public
  USING (true);

-- JANGAN buat policy untuk UPDATE atau DELETE pada tabel proposals.
-- Dengan begini, akses langsung (REST API) untuk UPDATE dan DELETE diblokir oleh RLS.

-- Buat fungsi RPC khusus dengan SECURITY DEFINER agar bisa bypass RLS
-- Fungsi ini mengecek tabel admins terlebih dahulu
CREATE OR REPLACE FUNCTION admin_update_proposal(
  p_id UUID, 
  p_status TEXT, 
  p_alasan TEXT,
  p_username TEXT, 
  p_password TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Verifikasi admin
  SELECT EXISTS(
    SELECT 1 FROM admins 
    WHERE username = p_username AND password = p_password
  ) INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Akses ditolak: Username atau password admin tidak valid.';
  END IF;

  -- Jika admin valid, lakukan update
  UPDATE proposals
  SET 
    status = p_status,
    alasan_tolak = p_alasan
  WHERE id = p_id;

  RETURN TRUE;
END;
$$;

-- Fungsi untuk update multiple proposals (Finalisasi)
CREATE OR REPLACE FUNCTION admin_update_multiple_proposals(
  p_ids UUID[], 
  p_status TEXT, 
  p_username TEXT, 
  p_password TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Verifikasi admin
  SELECT EXISTS(
    SELECT 1 FROM admins 
    WHERE username = p_username AND password = p_password
  ) INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Akses ditolak: Username atau password admin tidak valid.';
  END IF;

  -- Jika admin valid, lakukan update
  UPDATE proposals
  SET status = p_status
  WHERE id = ANY(p_ids);

  RETURN TRUE;
END;
$$;
