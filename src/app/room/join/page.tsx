'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, joinRoom } from '@/lib/appService';
import { DEFAULT_AVATARS } from '@/lib/defaultAvatars';
import { UserProfile } from '@/types';
import FloatingHearts from '@/components/FloatingHearts';
import { Heart, KeyRound, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function JoinRoomPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  // Form
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('girl-1');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      if (!currentUser) {
        router.push('/auth');
      } else {
        setUser(currentUser);
        setNickname(currentUser.display_name || currentUser.username || 'Em');
        if (currentUser.avatar_url) setAvatar(currentUser.avatar_url);
      }
    });
  }, [router]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!code.trim()) {
      setErrorMsg('Vui lòng nhập mã phòng');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const { room, error } = await joinRoom(
      user.id,
      code.trim().toUpperCase(),
      nickname || 'Em',
      avatar
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-200">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">
              Vào Không Gian Yêu
            </h1>
            <p className="text-xs text-gray-500">Nhập mã phòng do người ấy chia sẻ để ghép đôi</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          {/* Mã Phòng Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Mã Phòng (6-8 Ký Tự) *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VD: LOVE882 hoặc SWEET31"
              className="w-full px-4 py-3 rounded-2xl glass-input text-gray-800 font-mono text-center text-lg sm:text-xl font-bold tracking-widest uppercase placeholder:font-sans placeholder:text-sm placeholder:tracking-normal"
            />
          </div>

          {/* Biệt danh */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Biệt Danh Của Bạn</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="VD: Em iu, Bé Mèo..."
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-gray-800 text-sm"
            />
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
                      ? 'border-purple-500 bg-purple-100/90 shadow-xs scale-105'
                      : 'border-transparent bg-white/60 hover:bg-purple-50'
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-300/60 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 active:scale-98 transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Đang kiểm tra mã phòng...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ghép Đôi & Vào Không Gian</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
