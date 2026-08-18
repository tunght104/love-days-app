import { TimePassed, Milestone } from '@/types';
import { differenceInDays, addDays, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function calculateTimePassed(startDateStr: string): TimePassed {
  if (!startDateStr) {
    return {
      totalDays: 0,
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const start = new Date(startDateStr);
  const now = new Date();

  // Reset hours to start of day for clean day counting
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = now.getTime() - start.getTime();
  const isFuture = diffTime < 0;

  // Day count (counting start date as Day 1 if passed)
  const daysDiff = differenceInDays(nowMidnight, startMidnight);
  const totalDays = isFuture ? 0 : Math.max(1, daysDiff + 1);

  // Exact real-time breakdown
  const absDiff = Math.abs(diffTime);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Year / Month / Day breakdown
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    totalDays,
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours,
    minutes,
    seconds,
  };
}

export function calculateMilestones(startDateStr: string): Milestone[] {
  if (!startDateStr) return [];

  const start = new Date(startDateStr);
  const now = new Date();
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentDays = Math.max(1, differenceInDays(nowMidnight, startMidnight) + 1);

  const targets = [
    { id: 'm-30', title: '1 Tháng', days: 30 },
    { id: 'm-50', title: '50 Ngày', days: 50 },
    { id: 'm-100', title: '100 Ngày', days: 100 },
    { id: 'm-200', title: '200 Ngày', days: 200 },
    { id: 'm-300', title: '300 Ngày', days: 300 },
    { id: 'm-365', title: '1 Năm (365 ngày)', days: 365 },
    { id: 'm-500', title: '500 Ngày', days: 500 },
    { id: 'm-730', title: '2 Năm (730 ngày)', days: 730 },
    { id: 'm-1000', title: '1000 Ngày (Cột mốc vàng)', days: 1000 },
    { id: 'm-1095', title: '3 Năm (1095 ngày)', days: 1095 },
    { id: 'm-1825', title: '5 Năm (Bên nhau trọn đời)', days: 1825 },
    { id: 'm-3650', title: '10 Năm (Hạnh phúc viên mãn)', days: 3650 },
  ];

  return targets.map((t) => {
    const targetDate = addDays(startMidnight, t.days - 1);
    const daysRemaining = t.days - currentDays;
    const isPassed = currentDays >= t.days;
    const progressPercent = Math.min(100, Math.max(0, Math.round((currentDays / t.days) * 100)));

    return {
      id: t.id,
      title: t.title,
      days: t.days,
      targetDate,
      daysRemaining: Math.max(0, daysRemaining),
      isPassed,
      progressPercent,
    };
  });
}

export function formatDateVietnamese(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'EEEE, dd/MM/yyyy', { locale: vi });
  } catch {
    return String(date);
  }
}
