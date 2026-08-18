-- ==============================================================================
-- LOVE APP - SUPABASE DATABASE SCHEMA
-- Hướng dẫn: Copy toàn bộ nội dung file này và dán vào Supabase SQL Editor -> Nhấn RUN.
-- ==============================================================================

-- 1. Bật extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tạo bảng Profiles (Hồ sơ người dùng)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT DEFAULT '/avatars/avatar-1.png',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tạo bảng Rooms (Không gian tình yêu của 2 người)
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    love_quote TEXT DEFAULT 'Mỗi ngày bên nhau là một ngày hạnh phúc 💕',
    creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    creator_nickname TEXT,
    partner_nickname TEXT,
    creator_avatar TEXT DEFAULT '/avatars/avatar-1.png',
    partner_avatar TEXT DEFAULT '/avatars/avatar-2.png',
    bg_theme TEXT DEFAULT 'rose-gradient',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index tìm kiếm mã phòng nhanh
CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(code);
CREATE INDEX IF NOT EXISTS idx_rooms_creator_id ON public.rooms(creator_id);
CREATE INDEX IF NOT EXISTS idx_rooms_partner_id ON public.rooms(partner_id);

-- 4. Bảng Room Hearts (Sự kiện gửi tim tương tác realtime)
CREATE TABLE IF NOT EXISTS public.room_hearts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    sender_name TEXT,
    message TEXT DEFAULT '❤️',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_room_hearts_room_id ON public.room_hearts(room_id);

-- 5. Trigger tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_rooms_updated_at ON public.rooms;
CREATE TRIGGER set_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Trigger tự động tạo profile khi user đăng ký trong Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
    user_display TEXT;
BEGIN
    user_name := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
    user_display := COALESCE(NEW.raw_user_meta_data->>'display_name', user_name);

    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        user_name,
        user_display,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '/avatars/avatar-1.png')
    )
    ON CONFLICT (id) DO UPDATE
    SET username = EXCLUDED.username,
        display_name = EXCLUDED.display_name;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Thiết lập Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_hearts ENABLE ROW LEVEL SECURITY;

-- Policies cho Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Policies cho Rooms
DROP POLICY IF EXISTS "Users can view rooms they belong to or open rooms by code" ON public.rooms;
CREATE POLICY "Users can view rooms they belong to or open rooms by code"
ON public.rooms FOR SELECT
USING (
    auth.uid() = creator_id 
    OR auth.uid() = partner_id 
    OR partner_id IS NULL
);

DROP POLICY IF EXISTS "Users can create rooms" ON public.rooms;
CREATE POLICY "Users can create rooms"
ON public.rooms FOR INSERT
WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Room members can update room" ON public.rooms;
CREATE POLICY "Room members can update room"
ON public.rooms FOR UPDATE
USING (
    auth.uid() = creator_id 
    OR auth.uid() = partner_id 
    OR partner_id IS NULL
);

-- Policies cho Room Hearts
DROP POLICY IF EXISTS "Room members can view hearts" ON public.room_hearts;
CREATE POLICY "Room members can view hearts"
ON public.room_hearts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.rooms r
        WHERE r.id = room_hearts.room_id
        AND (r.creator_id = auth.uid() OR r.partner_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Room members can send hearts" ON public.room_hearts;
CREATE POLICY "Room members can send hearts"
ON public.room_hearts FOR INSERT
WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
        SELECT 1 FROM public.rooms r
        WHERE r.id = room_hearts.room_id
        AND (r.creator_id = auth.uid() OR r.partner_id = auth.uid())
    )
);

-- 8. Bật Realtime cho Rooms và Room Hearts
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_hearts;
