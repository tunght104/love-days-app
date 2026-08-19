'use client';

import React from 'react';
import { getAvatarById } from '@/lib/defaultAvatars';
import { Heart, UserPlus } from 'lucide-react';

interface CoupleAvatarsProps {
  creatorNickname: string;
  creatorAvatar: string;
  partnerNickname: string | null;
  partnerAvatar: string | null;
  hasPartner: boolean;
  onInviteClick?: () => void;
}

export default function CoupleAvatars({
  creatorNickname,
  creatorAvatar,
  partnerNickname,
  partnerAvatar,
  hasPartner,
  onInviteClick,
}: CoupleAvatarsProps) {
  const cAvatar = getAvatarById(creatorAvatar);
  const pAvatar = getAvatarById(partnerAvatar);

  return (
    <div className="relative my-4 flex items-start justify-center gap-2 py-2 sm:gap-8">
      {/* Creator Card */}
      <div className="group flex min-w-0 flex-1 flex-col items-center transition-transform duration-300 hover:scale-105 sm:flex-none">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 p-[3px] shadow-lg shadow-pink-200">
            <div className={`w-full h-full rounded-full bg-gradient-to-br ${cAvatar.gradient} flex items-center justify-center text-3xl sm:text-4xl shadow-inner`}>
              {cAvatar.emoji}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white px-2 py-0.5 rounded-full text-[11px] font-bold text-pink-600 shadow-sm border border-pink-100">
            YOU
          </div>
        </div>
        <span className="mt-2 w-full text-center text-base font-bold leading-snug break-words text-gray-800 sm:w-[120px] sm:text-lg">
          {creatorNickname || 'Anh'}
        </span>
      </div>

      {/* Center Animated Heart Line — mobile wraps & centers; desktop stays one line */}
      <div className="relative flex w-[4.75rem] shrink-0 flex-col items-center sm:w-auto">
        <div className="relative flex h-10 w-full items-center justify-center sm:h-12 sm:w-16">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-pink-300 via-rose-400 to-pink-300 sm:w-16" />
          <div className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white/90 shadow-md shadow-rose-300 animate-heartbeat sm:h-12 sm:w-12">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500 sm:h-6 sm:w-6" />
          </div>
        </div>
        <span className="mt-3 w-full text-center text-[11px] font-semibold uppercase leading-tight tracking-widest text-rose-400 sm:whitespace-nowrap">
          Love Forever
        </span>
      </div>

      {/* Partner Card */}
      {hasPartner ? (
        <div className="group flex min-w-0 flex-1 flex-col items-center transition-transform duration-300 hover:scale-105 sm:flex-none">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-[3px] shadow-lg shadow-purple-200">
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${pAvatar.gradient} flex items-center justify-center text-3xl sm:text-4xl shadow-inner`}>
                {pAvatar.emoji}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white px-2 py-0.5 rounded-full text-[11px] font-bold text-purple-600 shadow-sm border border-purple-100">
              LOVER
            </div>
          </div>
          <span className="mt-2 w-full text-center text-base font-bold leading-snug break-words text-gray-800 sm:w-[120px] sm:text-lg">
            {partnerNickname || 'Em'}
          </span>
        </div>
      ) : (
        <button
          onClick={onInviteClick}
          type="button"
          className="group flex min-w-0 flex-1 flex-col items-center text-left transition-transform duration-300 hover:scale-105 sm:flex-none cursor-pointer"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-pink-300 bg-pink-50/70 flex flex-col items-center justify-center text-pink-400 group-hover:bg-pink-100/70 group-hover:border-pink-400 transition-all shadow-sm">
            <UserPlus className="w-7 h-7 mb-1" />
            <span className="text-[10px] font-semibold">Mời người ấy</span>
          </div>
          <span className="mt-2 text-sm font-medium text-pink-500 underline decoration-dotted">
            Đang chờ...
          </span>
        </button>
      )}
    </div>
  );
}
