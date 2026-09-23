# Điểm danh Hàng ngày (Daily Check-in)

## 1. Mục đích

Khuyến khích người dùng quay trở lại app mỗi ngày. Yếu tố Gamification cốt lõi để giữ chân người dùng (Retention).

## 2. Phần thưởng

- Thưởng tăng dần theo chuỗi liên tiếp (Streak).
- Nếu bỏ lỡ 1 ngày, streak sẽ reset về 1.
- Chu trình thưởng lặp lại mỗi 7 ngày.

**Bảng phần thưởng dự kiến:**
| Ngày Streak | Số Ngọc Nhận Được |
|---|---|
| Ngày 1 | 50 💎 |
| Ngày 2 | 60 💎 |
| Ngày 3 | 70 💎 |
| Ngày 4 | 80 💎 |
| Ngày 5 | 90 💎 |
| Ngày 6 | 100 💎 |
| Ngày 7 | 200 💎 |

_Sau ngày thứ 7, chu trình quay lại phần thưởng của ngày 1 (hoặc tiếp tục N8=N1)._

## 3. Storage

Sử dụng bảng `daily_check_ins`:

- `user_id`: Người điểm danh.
- `checked_date`: Ngày điểm danh (chỉ ngày `YYYY-MM-DD`, không màng giờ giấc để so sánh dễ).
- `streak`: Streak tính đến ngày này.
- `gems_earned`: Số ngọc thực nhận.

Sử dụng `UNIQUE(user_id, checked_date)` ở database để đảm bảo mỗi người chỉ ấn nút điểm danh 1 lần mỗi ngày dù frontend có gọi API liên tục (Concurrency protection).
