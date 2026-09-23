# Hệ thống Ngọc Vàng (Gem Wallet)

## 1. Tổng quan

Ngọc Vàng (Gems) là đơn vị tiền tệ ảo (virtual currency) duy nhất trên nền tảng World of Self. Chức năng chính:

- Mua sắm vật phẩm ảo trong cửa hàng (khung avatar, biểu tượng, thú cưng 2d).
- Tặng lì xì (Donate/Transfer) cho bạn bè qua các bài viết thú vị.

## 2. Gem Wallet Entity

Mỗi User có một ví duy nhất (`GemWallet`), chứa thông tin số dư (`balance`).
Lúc User đăng ký mới, hệ thống tự động khởi tạo 1 ví với số dư bằng `0` thông qua sự kiện Đăng ký hoặc cơ chế hook. Nhưng hiện tại, dự án dùng pattern: Khi nào User lần đầu nhận Ngọc, code Backend sẽ kiểm tra xem ví có chưa, nếu chưa sẽ tạo mới (Lazy creation).

## 3. Các cách kiếm Ngọc Vàng hiện tại

1. Nhập Mã Tân Thủ (`TANTHU`).
2. Điểm danh mỗi ngày.
3. Vòng quay may mắn (1 lần 1 ngày).
4. Hệ thống Nhiệm vụ (Roadmap tương lai).

## 4. Ràng buộc Logic

- Không bao giờ được phép `balance` < 0 (Số dư âm). Nếu chi tiêu vượt quá số dư, chặn ở Database (có thể dùng check constraint ở Postgres) hoặc chặn bằng logic ở service layer (`BadRequestException`).
- Update số dư phải được thực hiện cùng lúc với việc ghi log vào bảng Transaction (`gem_transactions`) sử dụng Transaction DB (`em.begin()`).
