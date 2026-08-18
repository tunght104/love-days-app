# 💕 LoveDays - Web Đếm Ngày Yêu Nhau (Next.js + Supabase + Vercel)

Ứng dụng web đếm ngày yêu nhau lãng mạn dành riêng cho các cặp đôi. Giao diện thiết kế theo phong cách **Romantic Glassmorphism** (hồng đào / tím pastel), hỗ trợ tạo phòng ghép đôi 2 người qua mã PIN 6 số, đếm số ngày và thời gian thực, quản lý các cột mốc kỷ niệm (Milestones), tương tác thả tim bay và đồng bộ dữ liệu với Supabase.

---

## ✨ Tính Năng Nổi Bật

- 🌸 **Giao diện Romantic Glassmorphism**: Thẻ kính mờ tinh tế, hiệu ứng hạt tim bay lơ lửng trên nền background và hiệu ứng chạm màn hình nở tim.
- 💑 **Ghép đôi 2 người bằng Mã Phòng 6 số**:
  - Người A tạo phòng -> Nhận mã (ví dụ: `LOVE882`) và gửi cho người B.
  - Người B chỉ cần nhập mã là vào ngay không gian chung của 2 người (giới hạn tối đa 2 người/phòng).
- ⏳ **Bộ đếm thời gian thực chính xác**:
  - Đếm tổng số ngày yêu nhau nổi bật.
  - Phân tích chi tiết: Năm • Tháng • Ngày.
  - Đồng hồ thời gian thực: Giờ : Phút : Giây trôi qua theo từng nhịp đập.
- 🏆 **Cột mốc kỷ niệm (Milestones)**: Tự động tính toán các mốc (30 ngày, 100 ngày, 1 năm, 2 năm, 1000 ngày,...) và đếm ngược số ngày còn lại kèm thanh tiến độ.
- 💖 **Tương tác Thả Tim Yêu Thương**: Nút "Gửi tim cho người ấy" với hiệu ứng pháo hoa trái tim rực rỡ và thông báo tức thì.
- 🎨 **Tùy biến linh hoạt**: Tự do chọn Avatar chibi/cute, đổi biệt danh 2 người, cập nhật ngày kỷ niệm và viết lời nhắn tình yêu (Quote).
- ☁️ **Sẵn sàng 100% cho Vercel & Supabase**: Hỗ trợ Supabase Auth, PostgreSQL, Realtime Subscriptions và cơ chế Fallback Demo linh hoạt.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

### 1. Cài đặt dependencies:
```bash
npm install
```

### 2. Cấu hình biến môi trường:
Tạo file `.env.local` ở thư mục gốc:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Chạy môi trường Development:
```bash
npm run dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Hướng Dẫn Thiết Lập Supabase Database (1 Click)

1. Truy cập [Supabase](https://supabase.com) và tạo một Project mới (miễn phí).
2. Vào mục **SQL Editor** ở thanh menu bên trái.
3. Mở file [supabase_schema.sql](file:///home/tkstung104/data/Study/love-app/supabase_schema.sql) trong dự án, copy toàn bộ nội dung và dán vào SQL Editor.
4. Nhấn **RUN** để khởi tạo các bảng (`profiles`, `rooms`, `room_hearts`), RLS policies, trigger tạo user và realtime publication.
5. Vào **Project Settings** -> **API** để lấy:
   - `Project URL` -> điền vào `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` -> điền vào `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🌐 Hướng Dẫn Deploy Lên Vercel

1. Đẩy code lên GitHub repository của bạn:
   ```bash
   git add .
   git commit -m "feat: complete LoveDays web app"
   git push origin main
   ```
2. Truy cập [Vercel](https://vercel.com) và nhấn **Add New...** -> **Project**.
3. Chọn GitHub repository `love-app` vừa push.
4. Ở phần **Environment Variables**, thêm 2 biến:
   - `NEXT_PUBLIC_SUPABASE_URL`: (URL Supabase của bạn)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Anon key Supabase của bạn)
5. Nhấn **Deploy**! Vercel sẽ tự động build và cung cấp cho bạn đường link web trực tiếp (ví dụ: `https://your-love-app.vercel.app`).

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: Next.js 14/15 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4, Glassmorphism, CSS Animations
- **Backend & Database**: Supabase (Auth, PostgreSQL, Row Level Security, Realtime)
- **Icons & Effects**: Lucide React, Canvas-confetti, Date-fns
