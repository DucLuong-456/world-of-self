# Rules

<RULE[websocket_conventions.md]>
# WebSocket Event & Payload Conventions

Khi phát triển các tính năng realtime bằng Socket.io trong NestJS, Agent cần tuân thủ:

1. **Event Naming Convention**: Đặt tên event theo format `domain:action`.
   - Ví dụ: `chat:send_message`, `chat:message_received`, `presence:user_online`.
2. **Payload Structure**: Payload nhận từ client nên sử dụng DTO class và validate thông qua WsValidationPipe.
3. **Response Structure**: Các Acknowledgement (Acks) trả về cho client phải thống nhất theo định dạng: `{ status: 'success' | 'error', data?: T, message?: string }`.
</RULE[websocket_conventions.md]>

<RULE[realtime_ui_state.md]>
# Realtime UI State Management Rules

Khi phát triển UI realtime trên NextJS:

1. **Optimistic Updates**: Khi gửi dữ liệu (ví dụ: gửi tin nhắn), giao diện phải hiển thị dữ liệu mới ngay lập tức. Sử dụng một `temp_id` (ví dụ: `uuid`) cho bản ghi tạm thời.
2. **Deduplication**: Khi nhận được event thành công từ server chứa bản ghi chính thức, phải thay thế bản ghi tạm thời bằng bản ghi chính thức (match theo `temp_id`) để tránh trùng lặp hiển thị.
3. **Unread Badges**: Số lượng chưa đọc (unread count) phải được duy trì cẩn thận trong state (Zustand hoặc React Query). Khi người dùng focus/mở cuộc hội thoại, reset bộ đếm và gửi event `chat:read_receipt` lên server.
</RULE[realtime_ui_state.md]>

<RULE[package_installation.md]>
# Package Installation Rule

Khi cài đặt package mới thông qua `npm install` (hoặc `yarn`, `pnpm`), bắt buộc phải cài đặt cả ở máy host (local) và bên trong container (ví dụ: `docker exec -w /app <container_name> npm install <package>`) để đảm bảo code đồng bộ và container nhận diện được các package mới.
</RULE[package_installation.md]>

<RULE[no_any.md]>
# TypeScript Typing Rule (No Any)

Tuyệt đối **không được sử dụng kiểu `any`** trong toàn bộ dự án (cả Frontend và Backend):
1. **Strict Typing**: Mọi biến, tham số hàm, callback, response và state đều phải được định nghĩa kiểu dữ liệu cụ thể (Interface, Type, Generics hoặc DTO).
2. **Fallback khi chưa rõ kiểu**: Sử dụng `unknown` kết hợp type guard (`typeof`, `instanceof`, schema validation) thay cho `any`.
3. **Casting**: Tuyệt đối không ép kiểu bằng `as any`. Sử dụng custom interface mở rộng (ví dụ: `AuthenticatedSocket extends Socket`) nếu cần bổ sung thuộc tính cho object của thư viện bên thứ ba.
</RULE[no_any.md]>
