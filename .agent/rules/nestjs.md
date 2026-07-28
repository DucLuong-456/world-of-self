---
trigger: always_on
description: Quy tắc lập trình Backend NestJS
---

# NestJS Development Rules

Khi phát triển hoặc chỉnh sửa code Backend (thư mục `backend`), Agent cần tuân thủ tuyệt đối các nguyên tắc sau:

1. **Architecture & Design Pattern:**
   - Tuân thủ cấu trúc module chuẩn của NestJS: `Controller` -> `Service` -> `Repository`.
   - Mỗi module nên được nhóm lại theo tính năng (Feature-based structure).

2. **Database & ORM:**
   - Dự án sử dụng **MikroORM** để tương tác SQL (Postgres). Không sử dụng TypeORM hoặc Prisma.
   - Khi tạo Entity, khai báo metadata đầy đủ bằng Decorators của MikroORM.
   - Bất cứ thay đổi nào ở Code Schema (Entity), gợi ý User chạy lệnh `npm run mg:create` để gen scripts SQLite/Postgres.

3. **Migration Style:**
   - Mọi file migration **bắt buộc** phải `extends MigrationWithTimestamps` (từ `../migration-with-timestamps`), **không** dùng `extends Migration` gốc của MikroORM.
   - Sử dụng các helper method có sẵn thay vì viết raw SQL string:
     - `this.addUuidPrimaryColumn(table)` — thêm cột `id` UUID primary key.
     - `this.addTimestampColumns(table)` — thêm `created_at`, `updated_at`.
     - `this.addSoftDeleteColumns(table)` — thêm `deleted_at`.
     - `this.addActorColumns(table)` — thêm `created_by`, `updated_by` (FK → users).
     - `this.createUniqueIndex(options)` — tạo unique index có điều kiện (soft delete, nullable).
   - Dùng Knex schema builder (`knex.schema.createTableIfNotExists`, `alterTable`, `dropTableIfExists`) thay vì `this.addSql(raw SQL string)`.
   - Luôn implement cả `up()` và `down()` đảm bảo rollback được đầy đủ.

4. **Data Transfer Objects (DTO):**
   - Luôn định nghĩa các Interface/Class DTO ở thư mục `dto` nằm trong mỗi module.
   - Sử dụng `class-validator` và `class-transformer` để validate request payload.

5. **Response formatting:**
   - Đảm bảo trả về Response theo cấu trúc chuẩn (ví dụ { data, paging }).
   - Chú ý giữ nguyên các Interceptor đang tái cấu trúc API format của dự án nếu có.
