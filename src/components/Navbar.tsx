'use client';

import React, { useState } from 'react';
import { Room, UserProfile } from '@/types';
import { Heart, Copy, Check, Settings, LogOut, Share2 } from 'lucide-react';
import { logoutUser } from '@/lib/appService';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  room: Room | null;
  currentUser: UserProfile | null;
  onOpenEdit: () => void;
}

export default function Navbar({ room, onOpenEdit }: NavbarProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!room?.code) return;
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/auth');
  };

  return (
    <header className="w-full max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between z-10">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-200">
          <Heart className="w-5 h-5 fill-white animate-heartbeat" />
        </div>
        <div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-romantic-gradient font-sans">
            LoveDays
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {room && (
          <>
            {/* Copy Room Code Button */}
            <button
              onClick={handleCopyCode}
              type="button"
              title="Nhấn để copy mã phòng gửi cho người ấy"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-pink-200 text-xs font-bold text-gray-700 hover:bg-pink-50 hover:border-pink-300 transition-all cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Đã copy!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-pink-500" />
                  <span className="font-mono text-pink-700">{room.code}</span>
                  <Copy className="w-3 h-3 text-gray-400" />
                </>
              )}
            </button>

            {/* Edit Room Button */}
            <button
              onClick={onOpenEdit}
              type="button"
              title="Cài đặt phòng"
              className="p-2 rounded-full bg-white/70 backdrop-blur-md border border-pink-200 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all cursor-pointer shadow-xs"
            >
              <Settings className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          type="button"
          title="Đăng xuất"
          className="p-2 rounded-full bg-white/70 backdrop-blur-md border border-pink-200 text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
