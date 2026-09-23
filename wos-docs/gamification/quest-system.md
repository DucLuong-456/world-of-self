# Hệ thống Nhiệm vụ (Quest System) - Đề xuất

## 1. Cơ chế hoạt động

Hệ thống Quest được thiết kế theo cơ chế **Tự động (Event-driven)**.
Người dùng không cần phải chủ động "nhận" nhiệm vụ. Thay vào đó, hệ thống backend sẽ tự động bắt các sự kiện (Post created, User followed, v.v...) và tiến hành cộng tiến độ (progress).

## 2. Các loại Quest

### 2.1. Nhiệm vụ Hàng ngày (Daily Quests)

Reset vào lúc `00:00` mỗi ngày.

- **Nhật ký buổi sáng:** Đăng 1 bài viết trong ngày hôm nay → [+30 💎]
- **Nhà ngoại giao:** Thả reaction cho 3 bài viết khác nhau → [+20 💎]
- **Người trò chuyện:** Comment vào 2 bài viết → [+25 💎]

### 2.2. Nhiệm vụ Tuần (Weekly Quests)

Reset vào thứ 2 hàng tuần.

- **Người kể chuyện:** Đăng tổng cộng 5 bài trong tuần → [+150 💎]
- **Kết giao:** Kết bạn hoặc follow 3 người mới → [+100 💎]
- **Streak Master:** Điểm danh đủ 5 ngày trong tuần → [+200 💎]

### 2.3. Thành tựu (Achievements)

Chỉ hoàn thành 1 lần duy nhất, vĩnh viễn.

- **Chào thế giới:** Đăng bài post đầu tiên trên ứng dụng → [+100 💎]
- **Khách hàng thân thiết:** Mua vật phẩm đầu tiên trong Cửa hàng → [+50 💎]
- **Nhà thông thái:** Đạt streak điểm danh 7 ngày liên tiếp → [+300 💎]
- **Đại gia:** Tích lũy được tổng cộng 1000 💎 trong ví (không tính số đã tiêu) → [+200 💎]

## 3. Kiến trúc Database Kiến nghị

Sẽ cần cấu trúc các bảng sau:

- `quest_definitions`: Lưu thông tin các quest (tên, mô tả, loại, số lượng yêu cầu, phần thưởng). Có thể seed qua file seeder.
- `user_quest_progress`: Lưu tiến độ hiện tại của mỗi User cho từng Quest, cùng trạng thái `completed`.

## 4. Hook/Event

Sử dụng event bus (hoặc module tương tự của NestJS) để tránh import chéo (circular dependency) giữa các module.
Ví dụ: `PostService` sau khi create gọi event `post.created` → `QuestService` bắt event, check nhiệm vụ "Nhật ký buổi sáng", nếu đủ → gọi `GemWalletService` thưởng ngọc cho User.
