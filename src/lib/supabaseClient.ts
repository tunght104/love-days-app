import { createClient } from '@supabase/supabase-js';

// Cấu hình cố định Supabase trực tiếp
export const SUPABASE_URL = 'https://oyburivhxhuggadkqlvu.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YnVyaXZoeGh1Z2dhZGtxbHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDI5MjYsImV4cCI6MjEwMjYxODkyNn0.jmuvOKrQDdq94nxieXHwETQYA7C7zZNsD_ui4ZXIBL0';

export const isSupabaseConfigured = (): boolean => true;

// Khởi tạo Supabase client trực tiếp
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



