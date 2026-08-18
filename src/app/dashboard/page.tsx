'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserRoom } from '@/lib/appService';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Room, UserProfile } from '@/types';
import FloatingHearts from '@/components/FloatingHearts';
import Navbar from '@/components/Navbar';
import CoupleAvatars from '@/components/CoupleAvatars';
import LoveCounter from '@/components/LoveCounter';
import MilestonesCard from '@/components/MilestonesCard';
import SendHeartButton from '@/components/SendHeartButton';
import EditRoomModal from '@/components/EditRoomModal';
import confetti from 'canvas-confetti';
import { Heart, PlusCircle, KeyRound, Sparkles, MessageCircleHeart } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [partnerHeartNotice, setPartnerHeartNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setCurrentUser(user);

    const userRoom = await getUserRoom(user.id);
    setRoom(userRoom);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Realtime Subscriptions for Room changes & Live Hearts
  useEffect(() => {
    if (!room?.id || !isSupabaseConfigured()) return;

    // Listen to changes in this room
    const roomChannel = supabase
      .channel(`room_${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          setRoom(payload.new as Room);
        }
      )
      .subscribe();

    // Listen to live hearts
    const heartsChannel = supabase
      .channel(`hearts_${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_hearts',
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          const heartEvent = payload.new as { sender_id: string; sender_name?: string };
          if (currentUser && heartEvent.sender_id !== currentUser.id) {
            // Partner sent a heart!
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff4b72', '#ff758c', '#c084fc', '#f472b6'],
              });
            } catch {
              // ignore
            }
            setPartnerHeartNotice(`${heartEvent.sender_name || 'Người ấy'} vừa gửi một trái tim yêu thương! 💕`);
            setTimeout(() => setPartnerHeartNotice(null), 4000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(heartsChannel);
    };
  }, [room?.id, currentUser]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 relative">
        <FloatingHearts />
        <div className="flex flex-col items-center gap-3 z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-xl shadow-pink-300 animate-heartbeat">
            <Heart className="w-8 h-8 fill-white" />
          </div>
          <span className="text-sm font-bold text-pink-600 animate-pulse">
            Đang tải không gian tình yêu...
          </span>
        </div>
      </main>
    );
  }

  // 1. Case: User has no room yet -> Onboarding choices
  if (!room) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <FloatingHearts />
        <Navbar room={null} currentUser={currentUser} onOpenEdit={() => {}} />

        <div className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 z-10 text-center my-auto animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-pink-300/60 mx-auto mb-4 animate-heartbeat">
            <Heart className="w-8 h-8 fill-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
            Chào {currentUser?.display_name || currentUser?.username} 👋
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Bạn chưa tham gia không gian nào. Hãy tạo phòng mới hoặc nhập mã để ghép đôi cùng người ấy nhé!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: Create Room */}
            <Link
              href="/room/create"
              className="p-5 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="font-bold text-base">Tạo Phòng Mới</span>
              <span className="text-xs text-pink-100 mt-1">
                Lập ngày yêu & nhận mã 6 số gửi người ấy
              </span>
            </Link>

            {/* Option 2: Join Room */}
            <Link
              href="/room/join"
              className="p-5 rounded-2xl bg-white/80 border border-purple-200 text-gray-800 shadow-md hover:bg-purple-50/80 transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <KeyRound className="w-6 h-6" />
              </div>
              <span className="font-bold text-base text-purple-900">Vào Phòng Bằng Mã</span>
              <span className="text-xs text-gray-500 mt-1">
                Nhập mã do người ấy gửi để ghép đôi
              </span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2. Case: Room exists -> Render Full Love Dashboard
  const isCreator = currentUser?.id === room.creator_id;
  const userNickname = isCreator ? room.creator_nickname : room.partner_nickname;
  const partnerNickname = isCreator ? room.partner_nickname : room.creator_nickname;
  const userAvatar = isCreator ? room.creator_avatar : room.partner_avatar;
  const partnerAvatar = isCreator ? room.partner_avatar : room.creator_avatar;
  const hasPartner = !!room.partner_id || (!isCreator && !!room.creator_id);

  return (
    <main className="min-h-screen flex flex-col pb-12 relative selection:bg-pink-300">
      <FloatingHearts />

      {/* Navbar Header */}
      <Navbar
        room={room}
        currentUser={currentUser}
        onOpenEdit={() => setIsEditModalOpen(true)}
      />

      {/* Live Partner Heart Notification Pop-up */}
      {partnerHeartNotice && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-rose-300 flex items-center gap-2 border border-white/50">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>{partnerHeartNotice}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full max-w-2xl mx-auto px-4 mt-2 z-10 flex flex-col items-center">
        {/* Main Love Card */}
        <div className="w-full glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 relative overflow-hidden animate-fade-in">
          {/* Couple Avatars & Pulsing Heart */}
          <CoupleAvatars
            creatorNickname={userNickname || 'Bạn'}
            creatorAvatar={userAvatar || 'boy-1'}
            partnerNickname={partnerNickname || 'Người ấy'}
            partnerAvatar={partnerAvatar || 'girl-1'}
            hasPartner={hasPartner}
            onInviteClick={() => setIsEditModalOpen(true)}
          />

          {/* Big Day Counter & Realtime Clock */}
          <LoveCounter startDate={room.start_date} />

          {/* Interactive Send Heart Button */}
          <SendHeartButton
            roomId={room.id}
            senderId={currentUser?.id || ''}
            senderName={userNickname || currentUser?.display_name || 'Người ấy'}
          />

          {/* Love Quote / Lời Nhắn Yêu Thương */}
          {room.love_quote && (
            <div className="mt-4 pt-4 border-t border-pink-100/80 flex items-center justify-center gap-2 text-center text-gray-700 italic text-sm sm:text-base px-4">
              <MessageCircleHeart className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span>&ldquo;{room.love_quote}&rdquo;</span>
            </div>
          )}
        </div>

        {/* Milestones Card */}
        <MilestonesCard startDate={room.start_date} />
      </div>

      {/* Edit Room Modal */}
      {isEditModalOpen && (
        <EditRoomModal
          room={room}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={(updated) => setRoom(updated)}
        />
      )}
    </main>
  );
}
