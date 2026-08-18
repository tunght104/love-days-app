export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Room {
  id: string;
  code: string;
  start_date: string;
  love_quote: string;
  creator_id: string | null;
  partner_id: string | null;
  creator_nickname: string | null;
  partner_nickname: string | null;
  creator_avatar: string | null;
  partner_avatar: string | null;
  bg_theme: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoomHeart {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string | null;
  message: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  days: number;
  targetDate: Date;
  daysRemaining: number;
  isPassed: boolean;
  progressPercent: number;
}

export interface TimePassed {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
