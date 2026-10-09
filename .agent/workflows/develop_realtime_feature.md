---
name: develop_realtime_feature
description: Quy trình 5 bước phát triển tính năng Realtime từ DB -> Gateway -> REST API -> UI -> Test
---

# Quy trình phát triển tính năng Realtime

Quy trình này cung cấp hướng dẫn từng bước để triển khai một tính năng thời gian thực (realtime) sử dụng WebSockets, từ database cho đến UI:

## Bước 1: Database Schema & Migration
- Xác định các dữ liệu cần lưu trữ (ví dụ: Tin nhắn, Trạng thái online, Read receipts).
- Tạo các Entity tương ứng bằng MikroORM.
- Tạo Migration file đảm bảo tuân thủ rule `nestjs.md` (sử dụng `MigrationWithTimestamps`).

## Bước 2: Realtime Gateway & WebSocket Infrastructure
- Tạo NestJS WebSocket Gateway (sử dụng `@nestjs/platform-socket.io`).
- Thiết lập Authentication (JWT Guard cho WebSockets).
- Định nghĩa các Room (nếu cần phát sóng cho một nhóm người dùng cụ thể) và logic Join/Leave.
- Đăng ký các Message Handlers cho các Event (`domain:action`).

## Bước 3: RESTful APIs & Business Logic
- Phát triển các API HTTP thông thường (REST) hỗ trợ tính năng Realtime.
  - Ví dụ: Lấy lịch sử chat (phân trang), tạo nhóm chat, upload file đính kèm.
- Giữ cho Gateway mỏng, uỷ thác các xử lý phức tạp sang Services.

## Bước 4: UI & State Management (Frontend)
- Xây dựng hoặc tái sử dụng Custom Hook (ví dụ `useSocket`) để kết nối Socket.io client.
- Lắng nghe các event từ server và cập nhật UI.
- Tuân thủ quy tắc Optimistic Update (sử dụng `temp_id`) để mang lại trải nghiệm mượt mà.
- Thiết kế UI Components theo guideline TailwindCSS & Shadcn.

## Bước 5: Integration & E2E Testing
- Mở ít nhất 2 cửa sổ/tab trình duyệt với 2 tài khoản khác nhau.
- Kiểm tra luồng gửi/nhận thời gian thực.
- Kiểm tra các trường hợp edge cases: Mất mạng (Disconnect), Reconnect, Access Token hết hạn.
