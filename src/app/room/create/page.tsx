'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, createRoom } from '@/lib/appService';
import { generateRoomCode } from '@/lib/codeGenerator';
import { DEFAULT_AVATARS } from '@/lib/defaultAvatars';
import { UserProfile } from '@/types';
import FloatingHearts from '@/components/FloatingHearts';
import { Heart, Calendar, RefreshCw, Sparkles, ArrowLeft, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CreateRoomPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  // Form
  const [code, setCode] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('boy-1');
  const [partnerNickname, setPartnerNickname] = useState('');
  const [loveQuote, setLoveQuote] = useState('Mỗi ngày bên nhau là một ngày hạnh phúc 💕');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setCode(generateRoomCode());
    getCurrentUser().then((currentUser) => {
      if (!currentUser) {
        router.push('/auth');
      } else {
        setUser(currentUser);
        setNickname(currentUser.display_name || currentUser.username || 'Anh');
        if (currentUser.avatar_url) setAvatar(currentUser.avatar_url);
      }
    });
  }, [router]);

  const handleRefreshCode = () => {
    setCode(generateRoomCode());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!startDate) {
      setErrorMsg('Vui lòng chọn ngày bắt đầu yêu nhau');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const { room, error } = await createRoom(
      user.id,
      code,
      startDate,
      nickname || 'Anh',
      avatar,
      partnerNickname || 'Em',
      loveQuote
    );

    setLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    if (room) {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingHearts />

      <div className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 z-10 animate-fade-in my-8">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-pink-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Link>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-200">
            <Heart className="w-6 h-6 fill-white animate-heartbeat" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">
              Tạo Không Gian Yêu Mới
            </h1>
            <p className="text-xs text-gray-500">Thiết lập ngày kỷ niệm và nhận mã phòng 6 số</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Generated Room Code Banner */}
          <div className="p-4 rounded-2xl bg-pink-100/70 border border-pink-200 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600 block">
                Mã Phòng Của Bạn
              </span>
              <span className="font-mono text-2xl font-black text-rose-700 tracking-wider">
                {code}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRefreshCode}
              className="p-2.5 rounded-xl bg-white/80 text-pink-600 hover:bg-white transition-all shadow-xs cursor-pointer"
              title="Đổi mã khác"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Ngày bắt đầu yêu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-pink-500" />
              Ngày Bắt Đầu Yêu Nhau *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-gray-800 text-sm font-medium"
            />
          </div>

          {/* Nicknames */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Biệt Danh Của Bạn</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="VD: Anh iu"
                className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Biệt Danh Người Ấy</label>
              <input
                type="text"
                value={partnerNickname}
                onChange={(e) => setPartnerNickname(e.target.value)}
                placeholder="VD: Em iu"
                className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-gray-800 text-sm"
              />
            </div>
          </div>

          {/* Chọn Avatar bạn */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Chọn Avatar Của Bạn</label>
            <div className="grid grid-cols-4 gap-2">
              {DEFAULT_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatar(av.id)}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    avatar === av.id
                      ? 'border-pink-500 bg-pink-100/90 shadow-xs scale-105'
                      : 'border-transparent bg-white/60 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                  <span className="text-[10px] text-gray-600 truncate w-full text-center mt-1">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Love Quote */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              <MessageSquare className="w-3.5 h-3.5 inline mr-1 text-pink-500" />
              Lời Nhắn Yêu Thương (Quote)
            </label>
            <textarea
              rows={2}
              value={loveQuote}
              onChange={(e) => setLoveQuote(e.target.value)}
              placeholder="VD: Mỗi ngày bên nhau là một ngày hạnh phúc 💕"
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-gray-800 text-sm"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-300/60 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 active:scale-98 transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Đang tạo phòng...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Bắt Đầu Không Gian Yêu</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
