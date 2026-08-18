import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Room, UserProfile, RoomHeart } from '@/types';

const DEMO_USER_KEY = 'love_app_demo_user';
const DEMO_ROOM_KEY = 'love_app_demo_room';
const DEMO_ALL_ROOMS_KEY = 'love_app_demo_all_rooms';

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
    // Demo mode lưu vào LocalStorage
    const demoUser: UserProfile = {
      id: 'demo-user-' + Math.random().toString(36).substring(2, 8),
      username: cleanUsername,
      display_name: displayName || cleanUsername,
      avatar_url: avatarId,
      created_at: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    }
    return { user: demoUser, error: null };
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

    if (error) return { user: null, error: error.message };

    const userProfile: UserProfile = {
      id: data.user?.id || '',
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
        error: 'Không thể kết nối đến máy chủ Supabase. Hãy kiểm tra xem Project URL có đang hoạt động trên Supabase không.',
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
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_USER_KEY);
      if (stored) {
        return { user: JSON.parse(stored) as UserProfile, error: null };
      }
      // Tạo user demo nhanh
      const demoUser: UserProfile = {
        id: 'demo-user-1',
        username: cleanUsername,
        display_name: cleanUsername,
        avatar_url: 'boy-1',
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      return { user: demoUser, error: null };
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, error: error.message };

    // Lấy profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const userProfile: UserProfile = {
      id: data.user.id,
      username: profile?.username || cleanUsername,
      display_name: profile?.display_name || cleanUsername,
      avatar_url: profile?.avatar_url || 'boy-1',
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
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return {
    id: session.user.id,
    username: profile?.username || session.user.email?.split('@')[0] || 'User',
    display_name: profile?.display_name || profile?.username || 'User',
    avatar_url: profile?.avatar_url || 'boy-1',
  };
}

// 4. Đăng xuất
export async function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEMO_USER_KEY);
  }
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
    const newRoom: Room = {
      id: 'demo-room-' + Math.random().toString(36).substring(2, 9),
      code: cleanCode,
      start_date: startDate,
      love_quote: loveQuote,
      creator_id: userId,
      partner_id: null,
      creator_nickname: creatorNickname || 'Anh',
      partner_nickname: partnerNickname || 'Em',
      creator_avatar: creatorAvatar || 'boy-1',
      partner_avatar: 'girl-1',
      bg_theme: 'rose-gradient',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_ROOM_KEY, JSON.stringify(newRoom));
      const allRooms = JSON.parse(localStorage.getItem(DEMO_ALL_ROOMS_KEY) || '{}');
      allRooms[cleanCode] = newRoom;
      localStorage.setItem(DEMO_ALL_ROOMS_KEY, JSON.stringify(allRooms));
    }
    return { room: newRoom, error: null };
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
    if (typeof window !== 'undefined') {
      const allRooms = JSON.parse(localStorage.getItem(DEMO_ALL_ROOMS_KEY) || '{}');
      let room = allRooms[cleanCode];
      if (!room) {
        const activeRoomStr = localStorage.getItem(DEMO_ROOM_KEY);
        if (activeRoomStr) {
          const activeRoom = JSON.parse(activeRoomStr);
          if (activeRoom.code === cleanCode) room = activeRoom;
        }
      }

      if (!room) {
        return { room: null, error: 'Không tìm thấy phòng với mã này. Hãy kiểm tra lại nhé!' };
      }

      if (room.partner_id && room.partner_id !== userId && room.creator_id !== userId) {
        return { room: null, error: 'Phòng này đã đủ 2 người rồi!' };
      }

      room.partner_id = userId;
      if (partnerNickname) room.partner_nickname = partnerNickname;
      if (partnerAvatar) room.partner_avatar = partnerAvatar;
      room.updated_at = new Date().toISOString();

      localStorage.setItem(DEMO_ROOM_KEY, JSON.stringify(room));
      allRooms[cleanCode] = room;
      localStorage.setItem(DEMO_ALL_ROOMS_KEY, JSON.stringify(allRooms));
      return { room, error: null };
    }
  }

  // Supabase
  const { data: existingRoom, error: fetchErr } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', cleanCode)
    .single();

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
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_ROOM_KEY);
      return stored ? JSON.parse(stored) : null;
    }
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
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_ROOM_KEY);
      if (stored) {
        const room = JSON.parse(stored);
        const updated = { ...room, ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem(DEMO_ROOM_KEY, JSON.stringify(updated));
        const allRooms = JSON.parse(localStorage.getItem(DEMO_ALL_ROOMS_KEY) || '{}');
        allRooms[room.code] = updated;
        localStorage.setItem(DEMO_ALL_ROOMS_KEY, JSON.stringify(allRooms));
        return { room: updated, error: null };
      }
    }
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
    return { success: true };
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
