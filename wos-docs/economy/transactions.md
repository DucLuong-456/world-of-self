# Lịch sử Giao dịch (Transactions)

## 1. Mục đích

Ghi nhận mọi biến động số dư trong `GemWallet` của User, phục vụ cho việc tracking, audit và hiển thị lịch sử ở trang Frontend.

## 2. Phân loại Giao dịch (Action Types)

Sử dụng `enum GemTxType` trong Entity `GemTransaction` để xác định loại giao dịch.

Các loại hiện tại:

- `EARN_INVITE` : Nhận ngọc từ nhập mã mời.
- `EARN_LOGIN` : Nhận ngọc từ điểm danh hàng ngày.
- `EARN_SPIN` : Nhận ngọc từ vòng quay may mắn.
- `EARN_QUEST` : Nhận ngọc từ hệ thống Nhiệm vụ (dự kiến).
- `SPEND_BUY` : Tiêu ngọc khi mua vật phẩm trong Shop.
- `TRANSFER_SEND` : Chuyển ngọc cho người khác.
- `TRANSFER_RECV` : Nhận ngọc từ người khác.

## 3. Workflow ghi log transaction

Bất cứ khi nào làm thay đổi `balance` trong `GemWallet`, luôn đồng thời (trong cùng 1 Unit of Work / Transaction Database DB):

1. Tính toán `balance_before` = `balance` hiện tại.
2. Cộng hoặc trừ (`balance_after` = `balance` sau giao dịch).
3. `em.create(GemTransaction, { ... })`.
4. `em.persistAndFlush([wallet, transaction])`.

Tính ACID của database được áp dụng chặt chẽ ở bước này (sử dụng `em.begin()` và `em.commit()`).
