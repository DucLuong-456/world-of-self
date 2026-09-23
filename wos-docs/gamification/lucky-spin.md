# Vòng quay may mắn (Lucky Spin)

## 1. Cơ chế

- Mỗi ngày 1 User được quyền click vào vòng quay đúng **1 lần**.
- Nhận phần thưởng là Ngọc Vàng ngẫu nhiên, số ngọc sẽ cộng thẳng vào ví.
- Quay qua 24:00 sẽ được cấp lượt quay của ngày hôm sau.

## 2. Xác suất phần thưởng (Weighted Random)

Kịch bản vòng quay chia làm 8 ô. Xác suất sẽ không được rải đều mà phân bổ theo trọng số.

| Ô số | Giá trị | Trọng số (Xác suất) |
| ---- | ------- | ------------------- |
| 1    | 30 💎   | 30%                 |
| 2    | 50 💎   | 25%                 |
| 3    | 100 💎  | 20%                 |
| 4    | 150 💎  | 10%                 |
| 5    | 200 💎  | 7%                  |
| 6    | 300 💎  | 5%                  |
| 7    | 500 💎  | 2%                  |
| 8    | 1000 💎 | 1%                  |

**Thuật toán Backend:** Random số từ `0` đến `99`. Dựa vào khung tích luỹ của trọng số để quyết định phần quà rơi vào ô nào, trả về `slot_index` cho Front-end.

## 3. UI/UX Frontend

- Front-end không chứa logic chọn quà, tất cả phụ thuộc vào `slot_index` (từ 0-7) trả về từ Backend.
- Áp dụng CSS `transform: rotate(...)` cộng thêm độ lệch theo `slot_index` (tầm 5 vòng xoay cơ bản + offset độ của ô) để tạo hiệu ứng quay kịch tính trước khi thông báo kết quả thật.
- UI bao gồm: Vòng Quay, Nút "Quay", và Lịch sử các lần quay trước đó của User (gần nhất bên trên).
