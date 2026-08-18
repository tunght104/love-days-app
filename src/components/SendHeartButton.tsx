'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';
import { sendHeart } from '@/lib/appService';

interface SendHeartButtonProps {
  roomId: string;
  senderId: string;
  senderName: string;
}

export default function SendHeartButton({ roomId, senderId, senderName }: SendHeartButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const handleSendHeart = async () => {
    if (isSending) return;
    setIsSending(true);
    setSentCount((prev) => prev + 1);

    // Heart Confetti animation
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ff4b72', '#ff758c', '#c084fc', '#f472b6', '#fb7185'],
        shapes: ['circle'],
      });
    } catch {
      // fallback if canvas not available
    }

    // Send to Supabase or local service
    await sendHeart(roomId, senderId, senderName, '❤️');

    setTimeout(() => {
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center my-3">
      <button
        onClick={handleSendHeart}
        disabled={isSending}
        type="button"
        className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-white text-base shadow-lg shadow-rose-300/50 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <Heart className={`w-5 h-5 fill-white text-white ${isSending ? 'scale-125 animate-ping' : 'animate-pulse'}`} />
        <span>Gửi Tim Cho Người Ấy</span>
        <Sparkles className="w-4 h-4 text-yellow-200" />
      </button>

      {sentCount > 0 && (
        <span className="text-xs text-pink-600 font-semibold mt-2 animate-fade-in">
          Đã gửi {sentCount} nhịp tim yêu thương 💕
        </span>
      )}
    </div>
  );
}
