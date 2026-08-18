'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, getCurrentUser } from '@/lib/appService';
import { DEFAULT_AVATARS } from '@/lib/defaultAvatars';
import FloatingHearts from '@/components/FloatingHearts';
import { Heart, Sparkles, User, Lock, Smile, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('boy-1');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if already logged in
    getCurrentUser().then((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ tên tài khoản và mật khẩu');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu tối thiểu 6 ký tự');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const { user, error } = await loginUser(username, password);
        if (error) {
          setErrorMsg(error);
          setLoading(false);
          return;
        }
        if (user) {
          router.push('/dashboard');
        }
      } else {
        const { user, error } = await registerUser(
          username,
          password,
          displayName || username,
          selectedAvatar
        );
        if (error) {
          setErrorMsg(error);
          setLoading(false);
          return;
        }
        if (user) {
          router.push('/dashboard');
        }
      }
    } catch {
      setErrorMsg('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingHearts />

      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 z-10 animate-fade-in my-8">
        {/* App Logo & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-rose-300/60 mb-3 animate-heartbeat">
            <Heart className="w-8 h-8 fill-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-romantic-gradient font-sans">
            LoveDays
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Đếm từng ngày yêu - Lưu trọn từng khoảnh khắc
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-pink-100/60 border border-pink-200/60 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              isLogin ? 'bg-white text-rose-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              !isLogin ? 'bg-white text-rose-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Tên Tài Khoản / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="VD: tunganh, linhem..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-gray-800 text-sm font-medium"
              />
            </div>
          </div>

          {/* Display Name (Only for Register) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Tên Hiển Thị / Biệt Danh
              </label>
              <div className="relative">
                <Smile className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="VD: Tùng Anh, Linh Xinh..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-gray-800 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Mật Khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-gray-800 text-sm font-medium"
              />
            </div>
          </div>

          {/* Avatar Picker (Only for Register) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Chọn Avatar Yêu Thích
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DEFAULT_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                      selectedAvatar === av.id
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
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-300/60 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 active:scale-98 transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Đang xử lý...</span>
            ) : (
              <>
                <span>{isLogin ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-400" />
            Không gian tình yêu riêng tư chỉ 2 người
          </p>
        </div>
      </div>
    </main>
  );
}
