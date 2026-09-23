---
name: create_migration
description: Tạo file migration MikroORM với tên file và class mô tả đúng thay đổi của database schema.
---

# Kỹ năng Tạo Migration (Create Migration Skill)

Khi User yêu cầu tạo một file migration cho những thay đổi ở Database Schema (Entity), bạn BẮT BUỘC phải thực hiện quy trình sau thay vì chỉ chạy lệnh gốc của MikroORM.

## Quy trình thực hiện

1. **Phân tích thay đổi:** 
   - Kiểm tra xem User vừa thay đổi/thêm/bớt cột hoặc bảng nào trong Entity.
   - Nghĩ ra một cái tên (bằng tiếng Anh, snake_case) mô tả NGẮN GỌN và CHÍNH XÁC nhất những thay đổi đó.
   - *Ví dụ:* Nếu thêm cột `summary` và `tags` vào bảng `Post`, tên migration sẽ là `add_summary_and_tags_to_posts`.

2. **Tạo file Migration:**
   - Sử dụng bash script để chạy lệnh sau trong thư mục `backend`:
     ```bash
     npm run mg:create -- --name <Tên_Mô_Tả_Đã_Nghĩ_Ra>
     ```
   - *Lưu ý:* Việc thêm tham số `--name` sẽ giúp MikroORM tự động nối tên vào sau Timestamp (VD: `Migration20260923045813_add_summary_and_tags_to_posts.ts`) và đặt luôn tên class tương ứng.

3. **Chỉnh sửa file Migration để tuân thủ Rule:**
   - Theo Rule `nestjs.md`, mọi file migration phải extends `MigrationWithTimestamps`.
   - Mở file migration vừa tạo ra (nằm ở `backend/src/entities/src/migrations/`).
   - Sửa `import { Migration } from '@mikro-orm/migrations';` thành `import { MigrationWithTimestamps } from '../migration-with-timestamps';`.
   - Đổi `extends Migration` thành `extends MigrationWithTimestamps`.
   - Nếu MikroORM sinh ra RAW SQL (dùng `this.addSql(...)`), bạn phải chủ động sửa lại thành Knex Schema Builder (`const knex = this.getKnexBuilder(); await knex.schema.alterTable(...)`) hoặc sử dụng các helper methods của `MigrationWithTimestamps` nếu có thể (như `addUuidPrimaryColumn`, `addTimestampColumns`, v.v...). Đừng quên viết `down()` để rollback.

4. **Báo cáo lại cho User:**
   - Tóm tắt lại file migration đã tạo, giải thích các hàm Schema Builder đã dùng (để User yên tâm).
