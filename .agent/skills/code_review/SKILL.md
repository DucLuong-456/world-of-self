---
name: code_review
description: >-
  Thực hiện review code toàn diện (Backend NestJS/MikroORM & Frontend NextJS/Realtime)
  đối chiếu với bộ Rules của dự án (no_any, nestjs, nextjs, websocket_conventions,
  realtime_ui_state, package_installation). Sử dụng khi User yêu cầu review thay đổi
  hiện tại hoặc trước khi hoàn tất một tính năng mới.
---

# Kỹ năng Review Code Dự Án (Code Review Skill)

Khi được yêu cầu review code (hoặc tự kiểm tra trước khi bàn giao tính năng), Agent phải thực hiện tuần tự các bước dưới đây:

## Bước 1: Thu thập phạm vi thay đổi (Scope Discovery)

1. Chạy lệnh kiểm tra trạng thái git:
   ```bash
   git status -s
   git diff --stat
   ```
2. Đọc chi tiết diff của các file đã sửa (`git diff`) và nội dung các file mới tạo (Untracked `??`).

## Bước 2: Đối chiếu Checklist Rules Bắt Buộc

### 1. Quy tắc TypeScript (`no_any.md`)

- Quét các file thay đổi xem có xuất hiện `: any`, `as any`, `<any>`, `any[]` hay không:
  ```bash
  git diff -U0 | grep -E "(: any|as any|<any>|any\[\])"
  ```
- Mọi biến, tham số hàm, response API, Socket payload, và state (Zustand / React Query) phải có kiểu cụ thể (`interface`, `type`, `DTO`, hoặc `unknown` kèm type guard).
- Ngay cả trong các file test (`*.spec.ts`), ưu tiên dùng `jest.Mocked<T>` hoặc `Partial<T>` thay vì `as any`.

### 2. Quy tắc Backend (`nestjs.md`)

- **Kiến trúc**: Đảm bảo luồng `Controller -> Service -> Repository`. Không viết truy vấn DB trực tiếp trong Controller hoặc Gateway.
- **MikroORM & Entity**:
  - Đã đăng ký Entity mới vào `mikro-orm.config.ts` và `MikroOrmModule.forFeature([...])` chưa?
  - Có vô tình gán đè thuộc tính của Managed Entity (ví dụ gán full URL từ `minioService.getFileUrl()` lên entity trước khi gọi `em.flush()`) làm hỏng dữ liệu gốc trong DB không?
- **Migration**:
  - Bắt buộc `extends MigrationWithTimestamps` (không dùng `extends Migration` gốc).
  - Sử dụng Knex Schema Builder (`this.getKnexBuilder()`) và các helper (`addUuidPrimaryColumn`, `addTimestampColumns`, `addSoftDeleteColumns`), không dùng raw SQL string `this.addSql(...)`.
  - Có đầy đủ cả `up()` và `down()`.
- **DTO & Validation**:
  - Các payload đầu vào (`@Body()`, `@Query()`, `@MessageBody()`) phải có class DTO nằm trong thư mục `dto/` kèm decorator `class-validator` / `class-transformer` và `@ApiProperty` / `@ApiPropertyOptional`.
- **Phân quyền (`@Auth(...)`)**:
  - Kiểm tra `@Auth(UserRole...)`: Nếu API dành cho người dùng thông thường nhưng Admin cũng cần dùng trên UI (ví dụ Chat, Stickers), cần truyền `@Auth(UserRole.User, UserRole.Admin)` để tránh lỗi `403 Forbidden`.

### 3. Quy tắc WebSocket (`websocket_conventions.md`)

- Tên sự kiện bắt buộc theo định dạng `domain:action` (ví dụ: `chat:send_message`, `chat:message_received`).
- Cấu trúc trả về (Ack và Broadcast) đồng nhất: `{ status: 'success' | 'error', data?: T, message?: string }`.

### 4. Quy tắc Frontend & Realtime (`nextjs.md` & `realtime_ui_state.md`)

- **Tổ chức thư mục**:
  - API calls đặt trong `frontend/src/services/`.
  - React Query hooks đặt trong `frontend/src/hooks/` và đăng ký key tại `frontend/src/hooks/keys.ts`.
  - Shared components đặt trong `frontend/src/components/`.
- **Realtime UI State**:
  - Có thực hiện **Optimistic Update** với `temp_id` (UUID) ngay khi gửi không?
  - Có thực hiện **Deduplication** (thay thế bản ghi tạm theo `temp_id` khi nhận Ack hoặc event từ Server) không?
  - Có cập nhật `last_message` và `unreadCounts` hợp lý không?

## Bước 3: Kiểm tra Build & Linter Tự Động

Chạy kiểm tra biên dịch TypeScript trên phần đã thay đổi:

- Backend: `cd backend && npm run build`
- Frontend: `cd frontend && npm run lint`

## Bước 4: Xuất Báo Cáo Review

Trình bày kết quả ngắn gọn, rõ ràng theo 3 mức độ kèm link tới dòng code (`[file.ts](file:///.../file.ts#L10-L20)`):

- 🔴 **Critical / Rule Violations**: Vi phạm Rules dự án, lỗi bảo mật/phân quyền, lỗi làm hỏng dữ liệu hoặc lỗi build (bắt buộc sửa ngay).
- 🟡 **Warnings / Edge Cases**: Các trường hợp biên chưa xử lý (loading/error state, rò rỉ bộ nhớ socket listener, race condition).
- 🟢 **Suggestions**: Gợi ý tối ưu hiệu năng hoặc làm sạch code.
