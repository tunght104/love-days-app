import { createClient } from '@supabase/supabase-js';

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/^["']|["']$/g, '');
const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/^["']|["']$/g, '');

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
  return (
    isValidHttpUrl(rawUrl) &&
    !!rawKey &&
    !rawUrl.includes('placeholder') &&
    !rawKey.includes('placeholder')
  );
};

const supabaseUrl = isValidHttpUrl(rawUrl) ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder';

// Khởi tạo Supabase client an toàn
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

