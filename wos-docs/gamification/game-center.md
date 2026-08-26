# Khu Trò Chơi (Game Center) - Đề xuất Roadmap

## 1. Mục đích

Tạo ra một khu vực giải trí mini-game tích hợp trực tiếp trên nền tảng web (Game Center) giúp:

- Tăng thời gian lưu lại trên phiên (Engagement Rate).
- Tạo ra "Sink" (Nơi tiêu ngọc) và "Faucet" (Nơi xả ngọc) để cân bằng lại Gem Economy.
- Các trò chơi được build hoàn toàn bằng UI của React (hoặc DOM APIs cơ bản) để ứng dụng nhẹ, không lệ thuộc Canvas/WebGL phức tạp.

## 2. Kiến trúc & Chống gian lận (Anti-Cheat)

Bất kỳ trò chơi nào có liên quan đến việc kiếm/mất Ngọc Vàng đều cần cơ chế **server-side validation** cơ bản:

- `POST /games/start`: Khi bắt đầu chơi, Client báo Backend. Server tạo session `game_session_id` và trừ ngay "Vé chơi" (nếu trò chơi thu phí).
- `POST /games/end`: Khi kết thúc, gởi điểm (score) và `game_session_id`. Server dùng thuật toán quy đổi điểm ra Ngọc và đóng session.
  _Nếu cần chặt chẽ hơn: client gửi payload được mã hóa/hashing cơ bản với secret key để tránh API bị gọi qua Postman._

## 3. Danh sách các Trò chơi đề xuất

### 3.1. Thẻ bài Trí nhớ (Memory Match)

- **Gameplay:** 12 hoặc 16 thẻ bài úp. User lật từng cặp để tìm 2 hình giống nhau (Ảnh vật phẩm/avatar).
- **Cơ chế:**
  - Vé: Miễn phí 3 lượt/ngày (hoặc 10 💎/lượt).
  - Thưởng: Hoàn thành < 30s → +50 💎; Hoàn thành 30s-60s → +20 💎.
- **Kỹ thuật Frontend:** Trạng thái lật bằng React state (mảng úp/ngửa) + CSS `transform: rotateY`.

### 3.2. WOS 2048 (Xép hình 2048 phiên bản vật phẩm)

- **Gameplay:** Gạt các khối để gộp `2 -> 4 -> 8`. Có thể thay số bằng cấp độ vật phẩm (Common -> Rare -> Epic -> Legendary).
- **Cơ chế:**
  - Vé: Miễn phí.
  - Thưởng: Đạt khối 512 → +10 💎, khối 1024 → +30 💎, khối 2048 → +100 💎.
- **Kỹ thuật Frontend:** Ma trận 2D state trong React, bắt event `keydown` Arrow keys.

### 3.3. Oẳn Tù Tì vs Bot (Rock Paper Scissors)

- **Gameplay:** Chọn Kéo / Búa / Bao quyết đấu với Bot hệ thống.
- **Cơ chế:**
  - Bet (Đặt cược): Cược tuỳ biến 10, 50, hoặc 100 💎.
  - Thưởng: Thắng ăn x2, Hoà trả lại vốn, Thua mất cược. _Streak thắng 3 trận liên tiếp nhận Bonus x3._
- **Kỹ thuật Frontend/Backend:** Code Frontend chỉ có 3 nút. Backend xử lý sinh random Bot choice, rất khó cheat và làm cực nhanh.

### 3.4. Flappy Bird (Bản WOS)

- **Gameplay:** Điều khiển nhân vật bay qua khoảng trống (Nhấn Space/Click).
- **Cơ chế:**
  - Vé: 5 💎 / lượt chơi.
  - Thưởng: 1 điểm bay qua chướng ngại vật = 1 💎. Pro sẽ lãi to, dở sẽ lỗ ngọc.
- **Kỹ thuật Frontend:** Dùng DOM update (setInterval/requestAnimationFrame) kết hợp React refs để tối ưu hiệu năng render.
