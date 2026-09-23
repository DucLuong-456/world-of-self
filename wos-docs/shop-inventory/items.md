# Cửa hàng (Shop) & Hệ thống Vật phẩm

## 1. Shop (Cửa hàng)

Nơi hiển thị các vật phẩm được hệ thống mở bán bằng Ngọc Vàng. User có thể thanh toán Ngọc để sở hữu vật phẩm trên Cửa hàng.

### Filter & Rarity (Độ hiếm)

Vật phẩm có 4 độ hiếm, mức giá có xu hướng phụ thuộc vào độ hiếm này:

- `COMMON` (Phổ thông)
- `RARE` (Hiếm)
- `EPIC` (Sử thi)
- `LEGENDARY` (Huyền thoại)

UI/UX Cửa Hàng có filter lọc theo các độ hiếm này. Giao diện Card sản phẩm (cả trong shop lẫn trong Kho đồ) được tuỳ biến màu gradient và khung viền dựa vào Rarity.

## 2. Inventory (Kho Đồ)

Nơi chứa toàn bộ vật phẩm mà User đã sắm thành công.

### Gom nhóm số lượng

Do User có thể mua một vật phẩm nhiều lần, bản ghi `UserItem` sẽ tách rời thành từng record cho mỗi lượt giao dịch (do có thể phát sinh thêm trường `gifted_by` nếu vật phẩm đó do nạp mã quà tặng hay người khác biếu).
Vì thế, UI của Kho Đồ cần Gom (Group By) theo `item_id`, báo hiệu số lượng `x2`, `x3` tương ứng thay vì render lặp lại card rác màn hình.

### Roadmap Tương lai

- **Showcase:** User được chọn max 3 đồ quý hiện ra trang Profile công khai.
- **Tặng Đồ (Gifting):** Đẩy 1 vật phẩm bất kỳ từ Kho Đồ sang Kho Đồ của người bạn. Trang thái update thành `status="gifted"`.
