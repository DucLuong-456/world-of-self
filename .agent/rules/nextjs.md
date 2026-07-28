---
trigger: always_on
description: Quy tắc lập trình Frontend NextJS
---

# NextJS Development Rules

Khi phát triển Frontend (thư mục `frontend`), tuân thủ các chỉ định sau:

1. **Framework & Styling:**
   - Dự án dùng NextJS (App/Pages router tuỳ theo thư mục src).
   - Sử dụng **TailwindCSS** kết hợp với **Shadcn/radix-ui** cho UI components. Không viết CSS thô khi không cần thiết.

2. **Cấu trúc thư mục:**
   - Các Component dùng chung phải đặt tại `@/components/`.
   - Page view chính sẽ nằm ở `@/app` hoặc `@/pages`.

3. **Giao tiếp API:**
   - Xử lý việc gọi API thông qua các file cấu hình tại lớp `services/` (Sử dụng Axios thiết lập có sẵn).
   - Truyền JWT Token hoặc setup Interceptor cẩn thận khi tương tác server `localhost:3001`.
4. **State Management:**
   - Ưu tiên React Query / Zustand để quản lý State cục bộ nếu dự án có cài đặt, hoặc React Hooks chuẩn.
