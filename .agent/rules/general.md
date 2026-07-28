---
description: Quy định chung về style, format và commit
---

# General Rules

Khi hỗ trợ người dùng, Agent cần tuân theo các quy định định dạng và giao tiếp sau:

1. **Giao tiếp (Communication):**
   - Luôn sử dụng Tiếng Việt một cách tự nhiên, lịch sự (ví dụ: xưng bạn/mình) trừ khi User yêu cầu dùng Tiếng Anh.
   - Khi giải thích lỗi, hãy ngắn gọn, tập trung vào nguyên nhân (Root cause) và cách sửa, không trình bày sáo rỗng dài dòng.

2. **Commit Code:**
   - Nếu phải commit code (git), sử dụng chuẩn Conventional Commits (ví dụ: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).

3. **Ghi đè file (File Editing):**
   - Luôn review cấu trúc file hiện tại bằng lsof hoặc view_file trước khi sửa một file mới.
   - Thêm comment tại nơi vừa sửa chữa nếu logic phức tạp.
