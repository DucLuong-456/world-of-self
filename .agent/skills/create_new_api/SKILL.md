---
name: create_new_api
description: Tạo API Resource mới sử dụng NestJS và MikroORM
---

# Kỹ năng Tạo API mới (NestJS + MikroORM)

Khi người dùng yêu cầu tạo một API hoặc bảng Database mới, Agent phải làm theo từng bước tuần tự sau:

1. **Bước 1: Khởi tạo module**
   Dùng lệnh Nest CLI ở trong thư mục `backend/` để tạo các bộ code cơ sở (module, controller, service):
   `npx nest g resource modules/<tên_chức_năng>`
   _Bạn nên hỏi User muốn tạo resource RESTful cơ bản không trước khi sinh code tự động._

2. **Bước 2: Xây dựng Entity**
   - Tạo file class nằm trong thư mục `entities/` của module.
   - Dùng các khai báo (Decorators) như `@Entity()`, `@PrimaryKey()`, `@Property()` của MikroORM.
   - Định nghĩa DTO rõ ràng.

3. **Bước 3: Đăng ký Entity và Database (Migration)**
   - Viết lệnh import Entity vào `MikroOrmModule.forFeature([MyEntity])` ở Module gốc.
   - Lời nhắc User: "Vui lòng chạy lệnh `npm run mg:create` và `npm run mg:up` để cập nhật Database" sau khi lưu file.

4. **Bước 4: Logic Service & Controller**
   - Viết các CRUD cơ bản vào Service.
   - Cung cấp Swagger Docs `@ApiTags()` ở Controller.
