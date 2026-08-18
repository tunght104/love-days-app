'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/appService';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">
      <div className="animate-pulse text-rose-500 font-bold text-lg">
        Đang tải LoveDays... 💕
      </div>
    </div>
  );
}
