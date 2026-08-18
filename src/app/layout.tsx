import type { Metadata, Viewport } from 'next';
import { Quicksand, Great_Vibes } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
});

export const metadata: Metadata = {
  title: 'LoveDays - Đếm Ngày Yêu Nhau | Không Gian Tình Yêu Của 2 Người',
  description: 'Ứng dụng đếm số ngày yêu nhau lãng mạn dành cho các cặp đôi. Theo dõi từng khoảnh khắc, kỷ niệm và gửi trọn yêu thương mỗi ngày.',
  keywords: ['đếm ngày yêu', 'love days counter', 'been together', 'kỷ niệm ngày yêu', 'couple app'],
  authors: [{ name: 'LoveDays App' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ff758c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${quicksand.variable} ${greatVibes.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col selection:bg-pink-300 selection:text-pink-900">
        {children}
      </body>
    </html>
  );
}
