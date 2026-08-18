'use client';

import React, { useEffect, useState } from 'react';
import { calculateTimePassed, formatDateVietnamese } from '@/lib/dateUtils';
import { TimePassed } from '@/types';
import { Sparkles, Calendar, Clock } from 'lucide-react';

interface LoveCounterProps {
  startDate: string;
}

export default function LoveCounter({ startDate }: LoveCounterProps) {
  const [time, setTime] = useState<TimePassed>(() => calculateTimePassed(startDate));

  useEffect(() => {
    // Initial calculation
    setTime(calculateTimePassed(startDate));

    // Update every second for live clock
    const timer = setInterval(() => {
      setTime(calculateTimePassed(startDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center text-center my-4">
      {/* Title badge */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100/80 border border-pink-200/80 text-xs sm:text-sm font-semibold text-pink-700 shadow-sm mb-3">
        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
        <span>ĐÃ BÊN NHAU ĐƯỢC</span>
        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
      </div>

      {/* Big Number Days */}
      <div className="relative my-1">
        <div className="text-6xl sm:text-8xl font-extrabold tracking-tight text-romantic-gradient font-sans drop-shadow-sm select-none">
          {time.totalDays}
        </div>
        <span className="text-xl sm:text-2xl font-bold text-rose-500 uppercase tracking-wider ml-1">
          NGÀY
        </span>
      </div>

      {/* Breakdown: Years, Months, Days */}
      {(time.years > 0 || time.months > 0) && (
        <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 mt-1 mb-3 bg-white/60 px-4 py-1 rounded-full shadow-xs">
          {time.years > 0 && <span>{time.years} Năm</span>}
          {time.years > 0 && time.months > 0 && <span>•</span>}
          {time.months > 0 && <span>{time.months} Tháng</span>}
          <span>•</span>
          <span>{time.days} Ngày</span>
        </div>
      )}

      {/* Real-time Clock (HH:MM:SS) */}
      <div className="flex items-center gap-2 sm:gap-3 mt-2 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-pink-200/60 shadow-xs">
        <Clock className="w-4 h-4 text-pink-500 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="flex items-center font-mono text-base sm:text-lg font-bold text-gray-800 tracking-wider">
          <span>{padZero(time.hours)}</span>
          <span className="mx-1 text-pink-400 animate-pulse">:</span>
          <span>{padZero(time.minutes)}</span>
          <span className="mx-1 text-pink-400 animate-pulse">:</span>
          <span className="text-rose-600">{padZero(time.seconds)}</span>
        </div>
      </div>

      {/* Start Date display */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-3 font-medium">
        <Calendar className="w-3.5 h-3.5 text-pink-400" />
        <span>Kỷ niệm từ: {formatDateVietnamese(startDate)}</span>
      </div>
    </div>
  );
}
