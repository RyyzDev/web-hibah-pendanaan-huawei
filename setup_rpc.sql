-- Jalankan script SQL ini di menu "SQL Editor" pada Dashboard Supabase Anda!

-- 1. Fungsi untuk menerima / menolak SATU proposal
CREATE OR REPLACE FUNCTION admin_update_proposal(
  admin_usr TEXT,
  admin_pwd TEXT,
  p_id UUID,
  new_status TEXT,
  new_alasan TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Verifikasi kredensial admin
  IF NOT EXISTS (
    SELECT 1 FROM admins 
    WHERE username = admin_usr AND password = admin_pwd
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Invalid admin credentials';
  END IF;

  -- Update status dan alasan
  UPDATE proposals 
  SET 
    status = new_status,
    alasan_tolak = new_alasan
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Fungsi untuk mengubah status BANYAK proposal sekaligus (Finalisasi)
CREATE OR REPLACE FUNCTION admin_update_multiple_proposals(
  admin_usr TEXT,
  admin_pwd TEXT,
  p_ids UUID[],
  new_status TEXT
) RETURNS VOID AS $$
BEGIN
  -- Verifikasi kredensial admin
  IF NOT EXISTS (
    SELECT 1 FROM admins 
    WHERE username = admin_usr AND password = admin_pwd
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Invalid admin credentials';
  END IF;

  -- Update banyak proposal sekaligus
  UPDATE proposals 
  SET status = new_status
  WHERE id = ANY(p_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
