# 🚀 MikroORM `upsertMany` Options Handbook

Tài liệu này hướng dẫn chi tiết các tùy chọn (options) trong hàm `em.upsertMany(Entity, data, options)`. Việc hiểu rõ các "nút điều chỉnh" này giúp bạn xử lý xung đột dữ liệu (data conflict) một cách chuyên nghiệp và tối ưu hiệu suất.

---

### 1. `onConflictFields` (Xác định điểm xung đột)

> **Mục đích:** Khai báo các cột được dùng để kiểm tra sự tồn tại của bản ghi (thường là Unique Key hoặc Primary Key).

- **Cơ chế:** Database sẽ dựa trên danh sách này để phát hiện khi nào bản ghi mới bị "đụng hàng" với bản ghi cũ.
- **Ví dụ:** `onConflictFields: ['user_id']`.
- **⚠️ Lưu ý:** Nếu không điền đúng các cột có ràng buộc `UNIQUE`, Database sẽ báo lỗi hoặc chèn trùng tùy vào cấu hình bảng.

### 2. `onConflictAction` (Hành động khi xung đột)

> **Mục đích:** Quyết định "số phận" của bản ghi khi xảy ra xung đột.

| Giá trị        | Tương ứng SQL | Mô tả                                                   |
| :------------- | :------------ | :------------------------------------------------------ |
| **`'merge'`**  | `DO UPDATE`   | **Cập nhật** bản ghi cũ bằng dữ liệu mới.               |
| **`'ignore'`** | `DO NOTHING`  | **Bỏ qua** bản ghi mới, giữ nguyên bản ghi cũ trong DB. |

### 3. `onConflictMergeFields` (Cột cần cập nhật)

> **Mục đích:** Chỉ định cụ thể những cột nào sẽ bị ghi đè (Chỉ dùng khi `onConflictAction: 'merge'`).

- **Mặc định:** MikroORM sẽ cập nhật **tất cả** các trường có trong `data` (trừ các trường trong `onConflictFields`).
- **Ví dụ:** `onConflictMergeFields: ['bio', 'location']`.
- **💡 Tip:** Giúp bảo vệ các dữ liệu nhạy cảm hoặc không muốn thay đổi khi seed lại.

### 4. `returning` (Dữ liệu trả về)

> **Mục đích:** Quyết định xem Database có cần trả lại dữ liệu sau khi thực hiện không.

- **`true` (Mặc định):** MikroORM sẽ `SELECT` lại các bản ghi để cập nhật Identity Map.
- **`false`:** Không lấy dữ liệu trả về.
- **🚀 Tại sao cần?** Trong Postgres, khi dùng `ignore`, dòng bị bỏ qua sẽ trả về `NULL`. Chỉnh `returning: false` giúp tránh lỗi `NotNull` của MikroORM và tăng tốc độ xử lý.

### 5. `batchSize` (Kích thước mỗi đợt)

> **Mục đích:** Chia nhỏ mảng dữ liệu khổng lồ thành nhiều câu lệnh SQL nhỏ hơn.

- **Vấn đề:** Các DB như Postgres giới hạn số lượng tham số (~65,000). Nếu chèn 100k dòng cùng lúc sẽ gây sập ứng dụng.
- **Khuyên dùng:** `batchSize: 1000` là con số "vàng" cho hiệu năng và an toàn.

### 6. `checkExistence` (Kiểm tra trước - Hiếm dùng)

> **Mục đích:** MikroORM sẽ tự `SELECT` trước để kiểm tra sự tồn tại rồi mới xử lý.

- **Lời khuyên:** Nên để **`false`** (mặc định) khi dùng `upsertMany`. Hãy để Database tự xử lý bằng cơ chế Native `ON CONFLICT` để đạt hiệu năng cao nhất.

---

### 🛡️ Mẫu cấu hình an toàn cho Seeder

```typescript
await em.upsertMany(UserProfile, profiles, {
  onConflictFields: ['user_id'],
  onConflictAction: 'merge', // Hoặc 'ignore' tùy nhu cầu
  returning: false, // Tăng tốc và tránh lỗi NULL trên Postgres
  batchSize: 1000, // Xử lý an toàn cho dữ liệu lớn
});
```
