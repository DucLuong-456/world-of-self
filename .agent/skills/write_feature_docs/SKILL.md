---
name: write_feature_docs
description: >-
  Viết mới hoặc cập nhật tài liệu kỹ thuật cho tính năng (Feature Documentation)
  trong thư mục docs/ theo khung chuẩn (Overview, Luồng hoạt động Mermaid, Database Schema,
  API/WebSocket Spec, Frontend Architecture và Checklist trước khi Test). Sử dụng khi
  bắt đầu thiết kế tính năng mới, sau khi code xong tính năng (trước khi chạy kiểm thử),
  hoặc khi User yêu cầu viết/cập nhật tài liệu.
---

# Kỹ năng Viết & Cập nhật Tài liệu Tính năng (Write Feature Docs Skill)

Khi làm một tính năng mới (hoặc nâng cấp tính năng hiện có), việc viết tài liệu chuẩn hóa vào thư mục `docs/` trước khi tiến hành kiểm thử giúp đồng bộ thiết kế giữa Backend, Frontend và làm cơ sở đối chiếu cho bước viết Test Case (`write_test_cases`).

## 1. Cấu trúc thư mục `docs/` của dự án

Toàn bộ tài liệu tính năng Fullstack (Backend + Frontend) được lưu tại thư mục `docs/` ở gốc dự án:

```text
docs/
├── README.md                     # Mục lục tổng hợp các tài liệu trong dự án
└── features/                     # Tài liệu chi tiết theo từng tính năng (kebab-case)
    ├── chat-stickers.md          # Ví dụ: Tính năng Sticker trong Chat
    └── <feature-name>.md         # File tài liệu của tính năng mới
```

## 2. Quy trình thực hiện (Workflow)

Khi kích hoạt skill này, Agent thực hiện tuần tự 3 bước:

### Bước 1: Kiểm tra tài liệu hiện có
1. Đọc `docs/README.md` và kiểm tra trong `docs/features/` xem tính năng này đã có tài liệu chưa.
2. Nếu **chưa có**: Tạo file mới `docs/features/<ten-tinh-nang>.md` theo **Khung chuẩn (Template)** ở Mục 3.
3. Nếu **đã có**: Cập nhật các phần thay đổi (Schema mới, API mới, luồng UI mới) và bổ sung vào mục Lịch sử thay đổi (Changelog) ở cuối file.

### Bước 2: Điền nội dung theo Khung chuẩn (Feature Doc Template)
Mọi file trong `docs/features/<ten-tinh-nang>.md` **BẮT BUỘC** phải tuân theo khung cấu trúc sau:

```markdown
# Tài liệu Tính năng: [Tên Tính Năng]

- **Trạng thái**: `Draft` | `Ready for Test` | `Released`
- **Cập nhật lần cuối**: YYYY-MM-DD
- **Phân hệ liên quan**: Backend (`modules/...`), Frontend (`app/...`, `components/...`)

---

## 1. Tổng quan & Mục tiêu (Overview)
- Mô tả ngắn gọn bài toán và giá trị mang lại cho người dùng (User / Admin).
- Các quyền hạn liên quan (`UserRole.User`, `UserRole.Admin`, `UserRole.Staff`).

## 2. Sơ đồ Luồng hoạt động (Workflow / Sequence Diagram)
Sử dụng sơ đồ `mermaid` (`sequenceDiagram` hoặc `flowchart LR`) để mô tả tương tác giữa Client, REST API / WebSocket Gateway, Database và dịch vụ bên thứ ba (MinIO, Gemini AI, Redis...).

## 3. Thiết kế Cơ sở dữ liệu (Database Schema)
- **Entities liên quan**: Link tới file Entity trong `backend/src/entities/src/entities/`.
- **Migrations**: Tên file migration tương ứng.
- **Cấu trúc bảng**:
  | Tên bảng | Cột chính | Kiểu dữ liệu | Ràng buộc / Ghi chú |
  | :--- | :--- | :--- | :--- |
  | `table_name` | `id`, `...` | `uuid`, `...` | PK, FK `ON DELETE CASCADE`, Soft Delete |

## 4. Đặc tả Backend (REST API & WebSocket)
### 4.1. REST Endpoints
| Method | Endpoint | Quyền (`@Auth`) | Request Payload / DTO | Response Format | Mô tả |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/...` | `User, Admin` | Query / Body DTO | `{ data: T, paging? }` | Mô tả ngắn |

### 4.2. WebSocket Events (Nếu có)
| Event Name (`domain:action`) | Chiều (Direction) | Payload DTO | Ack / Broadcast Format |
| :--- | :--- | :--- | :--- |
| `chat:send_message` | Client -> Server | `WsSendMessageDto` | `{ status: 'success' \| 'error', data, message }` |

## 5. Kiến trúc Frontend (Next.js)
- **Routes / Pages**: Đường dẫn trang (`frontend/src/app/...`).
- **Components**: Các component chính (`frontend/src/components/...`).
- **Services & Hooks**: File gọi API (`services/...`), React Query hooks (`hooks/...`, `QueryKey`).
- **State / Realtime**: Cách quản lý Zustand store, Optimistic Update (`temp_id`) và Deduplication.

## 6. Checklist Trước Khi Kiểm Thử (Pre-Test Readiness)
- [ ] Migration đã có cả `up()` và `down()`, kế thừa `MigrationWithTimestamps`.
- [ ] Không sử dụng kiểu `any` ở cả Backend và Frontend (`no_any.md`).
- [ ] Đã kiểm tra phân quyền `@Auth(...)` cho cả `User` và `Admin`.
- [ ] Đã sẵn sàng chuyển sang bước lập Test Matrix & Unit Test (sử dụng skill `write_test_cases`).
```

### Bước 3: Cập nhật Mục lục tại `docs/README.md`
Sau khi tạo/cập nhật file trong `docs/features/`, luôn mở `docs/README.md` để thêm hoặc cập nhật dòng liên kết tới tài liệu vừa viết cùng trạng thái hiện tại.

