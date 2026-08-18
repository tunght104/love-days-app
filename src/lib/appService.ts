import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Room, UserProfile } from '@/types';

// Helper biến đổi username thành email nội bộ của Supabase Auth
export function formatUsernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');
  return `${clean || 'user'}@loveapp.local`;
}

// 1. Đăng ký tài khoản
export async function registerUser(username: string, password: string, displayName: string, avatarId: string = 'boy-1') {
  const cleanUsername = username.trim().toLowerCase();
  const email = formatUsernameToEmail(cleanUsername);

  if (!isSupabaseConfigured()) {
    return {
      user: null,
      error: 'Chưa cấu hình Supabase. Vui lòng kiểm tra biến môi trường NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: cleanUsername,
          display_name: displayName || cleanUsername,
          avatar_url: avatarId,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return { user: null, error: 'Tên tài khoản này đã tồn tại. Vui lòng chọn tên khác hoặc chuyển sang Đăng Nhập!' };
      }
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Không thể tạo tài khoản, vui lòng thử lại.' };
    }

    const userProfile: UserProfile = {
      id: data.user.id,
      username: cleanUsername,
      display_name: displayName || cleanUsername,
      avatar_url: avatarId,
    };

    return { user: userProfile, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('Failed to fetch') || message.includes('fetch')) {
      return {
        user: null,
        error: 'Không thể kết nối đến máy chủ Supabase. Hãy kiểm tra lại kết nối mạng hoặc Project URL.',
      };
    }
    return { user: null, error: message };
  }
}

// 2. Đăng nhập tài khoản
export async function loginUser(username: string, password: string) {
  const cleanUsername = username.trim().toLowerCase();
  const email = formatUsernameToEmail(cleanUsername);

  if (!isSupabaseConfigured()) {
    return {
      user: null,
      error: 'Chưa cấu hình Supabase. Vui lòng kiểm tra biến môi trường NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { user: null, error: 'Sai tên tài khoản hoặc mật khẩu!' };
      }
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Đăng nhập không thành công.' };
    }

    // Lấy profile từ Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    const userProfile: UserProfile = {
      id: data.user.id,
      username: profile?.username || data.user.user_metadata?.username || cleanUsername,
      display_name: profile?.display_name || data.user.user_metadata?.display_name || cleanUsername,
      avatar_url: profile?.avatar_url || data.user.user_metadata?.avatar_url || 'boy-1',
    };

    return { user: userProfile, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('Failed to fetch') || message.includes('fetch')) {
      return {
        user: null,
        error: 'Không thể kết nối đến máy chủ Supabase. Hãy kiểm tra lại Project URL của dự án.',
      };
    }
    return { user: null, error: message };
  }
}

// 3. Lấy User hiện tại
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    return {
      id: session.user.id,
      username: profile?.username || session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
      display_name: profile?.display_name || session.user.user_metadata?.display_name || profile?.username || 'User',
      avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url || 'boy-1',
    };
  } catch {
    return null;
  }
}

// 4. Đăng xuất
export async function logoutUser() {
  if (isSupabaseConfigured()) {
    await supabase.auth.signOut();
  }
}

// 5. Tạo phòng mới
export async function createRoom(
  userId: string,
  code: string,
  startDate: string,
  creatorNickname: string,
  creatorAvatar: string,
  partnerNickname: string = '',
  loveQuote: string = 'Mỗi ngày bên nhau là một ngày hạnh phúc 💕'
) {
  const cleanCode = code.trim().toUpperCase();

  if (!isSupabaseConfigured()) {
    return { room: null, error: 'Chưa cấu hình kết nối Supabase.' };
  }

  const { data, error } = await supabase
    .from('rooms')
    .insert([
      {
        code: cleanCode,
        start_date: startDate,
        love_quote: loveQuote,
        creator_id: userId,
        creator_nickname: creatorNickname || 'Anh',
        partner_nickname: partnerNickname || 'Em',
        creator_avatar: creatorAvatar || 'boy-1',
        partner_avatar: 'girl-1',
      },
    ])
    .select()
    .single();

  if (error) return { room: null, error: error.message };
  return { room: data as Room, error: null };
}

// 6. Vào phòng bằng mã Code
export async function joinRoom(
  userId: string,
  code: string,
  partnerNickname: string,
  partnerAvatar: string
) {
  const cleanCode = code.trim().toUpperCase();

  if (!isSupabaseConfigured()) {
    return { room: null, error: 'Chưa cấu hình kết nối Supabase.' };
  }

  // Supabase
  const { data: existingRoom, error: fetchErr } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', cleanCode)
    .maybeSingle();

  if (fetchErr || !existingRoom) {
    return { room: null, error: 'Không tìm thấy phòng với mã này! Hãy kiểm tra lại.' };
  }

  if (existingRoom.partner_id && existingRoom.partner_id !== userId && existingRoom.creator_id !== userId) {
    return { room: null, error: 'Phòng này đã có đủ 2 người rồi!' };
  }

  // Nếu user chưa phải là creator hoặc partner, cập nhật partner_id
  if (existingRoom.creator_id !== userId) {
    const { data: updatedRoom, error: updateErr } = await supabase
      .from('rooms')
      .update({
        partner_id: userId,
        partner_nickname: partnerNickname || existingRoom.partner_nickname || 'Em',
        partner_avatar: partnerAvatar || existingRoom.partner_avatar || 'girl-1',
      })
      .eq('id', existingRoom.id)
      .select()
      .single();

    if (updateErr) return { room: null, error: updateErr.message };
    return { room: updatedRoom as Room, error: null };
  }

  return { room: existingRoom as Room, error: null };
}

// 7. Lấy phòng của user
export async function getUserRoom(userId: string): Promise<Room | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data } = await supabase
    .from('rooms')
    .select('*')
    .or(`creator_id.eq.${userId},partner_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as Room | null;
}

// 8. Cập nhật phòng (Ngày yêu, biệt danh, lời nhắn)
export async function updateRoomDetails(
  roomId: string,
  updates: Partial<Pick<Room, 'start_date' | 'love_quote' | 'creator_nickname' | 'partner_nickname' | 'creator_avatar' | 'partner_avatar'>>
) {
  if (!isSupabaseConfigured()) {
    return { room: null, error: 'Chưa cấu hình kết nối Supabase.' };
  }

  const { data, error } = await supabase
    .from('rooms')
    .update(updates)
    .eq('id', roomId)
    .select()
    .single();

  if (error) return { room: null, error: error.message };
  return { room: data as Room, error: null };
}

// 9. Gửi tim tương tác
export async function sendHeart(roomId: string, senderId: string, senderName: string, message: string = '❤️') {
  if (!isSupabaseConfigured()) {
    return { success: false };
  }

  const { error } = await supabase.from('room_hearts').insert([
    {
      room_id: roomId,
      sender_id: senderId,
      sender_name: senderName,
      message,
    },
  ]);

  return { success: !error };
}

