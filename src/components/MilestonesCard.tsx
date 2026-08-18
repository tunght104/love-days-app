'use client';

import React, { useState } from 'react';
import { calculateMilestones } from '@/lib/dateUtils';
import { Trophy, CheckCircle2, ChevronDown, ChevronUp, Hourglass } from 'lucide-react';
import { format } from 'date-fns';

interface MilestonesCardProps {
  startDate: string;
}

export default function MilestonesCard({ startDate }: MilestonesCardProps) {
  const [showAll, setShowAll] = useState(false);
  const milestones = calculateMilestones(startDate);

  // Find next milestone that is not passed
  const nextMilestone = milestones.find((m) => !m.isPassed) || milestones[milestones.length - 1];

  const displayedMilestones = showAll ? milestones : milestones.slice(0, 4);

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 w-full shadow-lg border border-pink-100/80 my-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">Cột Mốc Kỷ Niệm</h3>
            <p className="text-xs text-gray-500">Những dấu ấn tình yêu đáng nhớ</p>
          </div>
        </div>

        {nextMilestone && !nextMilestone.isPassed && (
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Còn {nextMilestone.daysRemaining} ngày
            </span>
          </div>
        )}
      </div>

      {/* Next Upcoming Highlight Box */}
      {nextMilestone && !nextMilestone.isPassed && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-200/80 mb-4">
          <div className="flex justify-between items-center text-sm font-bold text-gray-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Hourglass className="w-4 h-4 text-pink-500" />
              Sắp tới: {nextMilestone.title}
            </span>
            <span className="text-xs text-pink-600 font-semibold">{nextMilestone.progressPercent}%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-pink-400 to-rose-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${nextMilestone.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-500 mt-1.5 font-medium">
            <span>Ngày kỷ niệm: {format(nextMilestone.targetDate, 'dd/MM/yyyy')}</span>
            <span>Đếm ngược: {nextMilestone.daysRemaining} ngày nữa</span>
          </div>
        </div>
      )}

      {/* List Milestones */}
      <div className="space-y-2.5">
        {displayedMilestones.map((m) => (
          <div
            key={m.id}
            className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
              m.isPassed
                ? 'bg-emerald-50/70 border border-emerald-200/60 text-emerald-900'
                : 'bg-white/60 border border-pink-100/70 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {m.isPassed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-pink-300 flex-shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                </div>
              )}
              <div>
                <span className={`text-sm font-semibold ${m.isPassed ? 'text-emerald-800' : 'text-gray-800'}`}>
                  {m.title}
                </span>
                <p className="text-[11px] text-gray-500">{format(m.targetDate, 'dd/MM/yyyy')}</p>
              </div>
            </div>

            <div className="text-right">
              {m.isPassed ? (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Đã đạt ✨
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-500">
                  Còn {m.daysRemaining} ngày
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expand / Collapse Button */}
      {milestones.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-center text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          {showAll ? (
            <>
              Thu gọn <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Xem tất cả ({milestones.length} mốc) <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
