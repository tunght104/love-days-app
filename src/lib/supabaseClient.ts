import { createClient } from '@supabase/supabase-js';

// Cấu hình cố định Supabase cho dự án
const DEFAULT_SUPABASE_URL = 'https://oyburivhxhuggadkqlvu.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YnVyaXZoeGh1Z2dhZGtxbHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDI5MjYsImV4cCI6MjEwMjYxODkyNn0.jmuvOKrQDdq94nxieXHwETQYA7C7zZNsD_ui4ZXIBL0';

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim().replace(/^["']|["']$/g, '');
const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim().replace(/^["']|["']$/g, '');

const isValidHttpUrl = (urlString: string): boolean => {
  if (!urlString) return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = (): boolean => {
  return isValidHttpUrl(rawUrl) && !!rawKey;
};

const supabaseUrl = isValidHttpUrl(rawUrl) ? rawUrl : DEFAULT_SUPABASE_URL;
const supabaseAnonKey = rawKey || DEFAULT_SUPABASE_ANON_KEY;

// Khởi tạo Supabase client trực tiếp
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


