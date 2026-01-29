# 🗂️ Hướng dẫn các loại Index trong PostgreSQL

Index (Chỉ mục) là "bản đồ" giúp tăng tốc độ truy vấn dữ liệu. Việc chọn đúng loại Index có thể biến một câu query từ vài giây xuống còn vài mili giây.

---

### 1. B-Tree Index (Mặc định & Phổ biến nhất)

> **Sử dụng khi:** Phù hợp với hầu hết các kiểu dữ liệu và toán tử so sánh.

- **Toán tử hỗ trợ:** `<`, `<=`, `=`, `>=`, `>`, `BETWEEN`, `IN`, `IS NULL`, `IS NOT NULL`.
- **Đặc điểm:** Sắp xếp dữ liệu theo cấu trúc cây cân bằng.
- **Khi nào dùng:** Cột ID, Ngày tháng, Tên, Số lượng... (Gần như 90% trường hợp dùng B-Tree).

### 2. Hash Index

> **Sử dụng khi:** Chỉ quan tâm đến so sánh bằng (`=`).

- **Toán tử hỗ trợ:** `=`.
- **Đặc điểm:** Chuyển đổi giá trị thành một mã hash. Nhanh hơn B-Tree một chút cho phép so sánh bằng nhưng không hỗ trợ so sánh khoảng.
- **Khi nào dùng:** Cột token, mã định danh mà bạn không bao giờ so sánh lớn/bé.

### 3. GIN (Generalized Inverted Index)

> **Sử dụng khi:** Dữ liệu chứa nhiều giá trị bên trong một cột (Multi-value).

- **Đặc điểm:** "Chỉ mục đảo ngược", cực kỳ mạnh mẽ cho dữ liệu phức tạp.
- **Khi nào dùng:**
  - **JSONB:** Truy vấn bên trong các trường JSON.
  - **Array:** Kiểm tra phần tử có nằm trong mảng không.
  - **Full-text Search:** Tìm kiếm từ khóa trong đoạn văn bản dài.

### 4. GiST (Generalized Search Tree)

> **Sử dụng khi:** Dữ liệu có tính chất bao hàm hoặc không gian.

- **Khi nào dùng:**
  - **Dữ liệu hình học (PostGIS):** Tìm các điểm trong một bán kính.
  - **Dữ liệu khoảng (Range types):** Tìm các khoảng thời gian chồng lấn nhau.
  - **Full-text Search:** (Thường chậm hơn GIN để tìm kiếm nhưng hỗ trợ cập nhật nhanh hơn).

### 5. BRIN (Block Range Index)

> **Sử dụng khi:** Bảng cực kỳ lớn (hàng trăm triệu dòng) và dữ liệu được sắp xếp theo thứ tự vật lý.

- **Đặc điểm:** Lưu giá trị Min/Max của từng khối dữ liệu thay vì từng dòng. Cực kỳ tiết kiệm dung lượng (nhỏ hơn B-Tree hàng trăm lần).
- **Khi nào dùng:** Cột `created_at` trong các bảng logs, event tracking khổng lồ.

---

### ⚡ Các kỹ thuật Index nâng cao

#### 🔹 Unique Index

Đảm bảo giá trị trong cột không được trùng lặp (Tự động được tạo khi khai báo `PRIMARY KEY`).

#### 🔹 Composite Index (Index đa cột)

Index trên nhiều cột cùng lúc.

- **Lưu ý:** Thứ tự cột rất quan trọng. Nếu index `(A, B)`, nó sẽ hỗ trợ query `WHERE A` hoặc `WHERE A AND B`, nhưng KHÔNG hỗ trợ `WHERE B`.

#### 🔹 Partial Index (Index một phần)

Chỉ index những dòng thỏa mãn điều kiện nhất định.

- **Ví dụ:** `CREATE INDEX idx_active_users ON users (email) WHERE deleted_at IS NULL;`
- **Lợi ích:** Tiết kiệm bộ nhớ và tăng tốc độ cho các bản ghi quan trọng.

#### 🔹 Expression Index (Index theo biểu thức)

Index kết quả của một hàm hoặc biểu thức.

- **Ví dụ:** `CREATE INDEX idx_lower_email ON users (LOWER(email));`
- **Lợi ích:** Tăng tốc khi bạn hay query `WHERE LOWER(email) = 'abc'`.

---

### 💡 Lời khuyên tối ưu

1.  **Đừng lạm dụng:** Mỗi index làm chậm thao tác `INSERT`, `UPDATE`, `DELETE` vì Database phải cập nhật cả index.
2.  **EXPLAIN ANALYZE:** Luôn sử dụng lệnh này để kiểm tra xem PostgreSQL có thực sự dùng Index của bạn không.
3.  **Monitor:** Những Index không bao giờ được sử dụng nên được xóa bỏ để tiết kiệm tài nguyên.
