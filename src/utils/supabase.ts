import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('⚠️ Konfigurasi Supabase belum lengkap! Aplikasi menggunakan pengaturan sementara. Silakan buat file .env dan isi VITE_SUPABASE_URL beserta VITE_SUPABASE_ANON_KEY Anda.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
