# World of Self

Dự án bao gồm Frontend (Next.js) và Backend (NestJS), cùng hệ thống Data/Cache (Postgres, Redis, MinIO) được chạy qua nền tảng Docker.

## Hướng dẫn cài đặt dự án (Local Development)

### Yêu cầu hệ thống

- **Node.js** v18 hoặc v20+
- **Docker** & **Docker Compose** (V2)

### 1. Khởi tạo biến môi trường (.env)

Bắt buộc phải tạo và cấu hình các biến môi trường cho cả 2 phần của dự án.
Mở terminal ở thư mục gốc của dự án và chạy:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

👉 **Lưu ý cực kỳ quan trọng:**
Do tính năng Google Login, bạn bắt buộc phải bổ sung bằng tay các biến này (nếu đang để trống):

- Thêm `NEXT_PUBLIC_GOOGLE_CLIENT_ID` vào `frontend/.env`.
- Thêm `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` vào `backend/.env`.
  _(Nếu sử dụng máy cá nhân, bạn cần tạo thông tin này trên Google Cloud Console. Nếu là dự án công ty, hãy hỏi cấp quyền từ Team)._

### 2. Khởi chạy hệ thống

Có hai hướng tiếp cận để build và chạy ứng dụng này, tuỳ thuộc vào thói quen phát triển của bạn:

#### Cách 1: Chạy Frontend và Backend ở phần mềm Host (Khuyến nghị để Code)

Cách này giúp bạn code dễ bắt lỗi hơn, do API và giao diện được chạy chằng trực tiếp trên Terminal của máy thay vì lồng trong Docker.

1. Bật toàn bộ vùng chứa Database, Cache, và Storage qua Docker:
   ```bash
   docker compose up -d postgres redis minio
   ```
2. Mở cửa sổ **Terminal 1** để chạy Backend:
   ```bash
   cd backend
   npm install
   npm run mg:up        # Chạy migration để tự động sinh Data Tables
   npm run seed:all     # (Tuỳ chọn) Tạo dữ liệu mẫu nếu có
   npm run start:dev
   ```
3. Mở cửa sổ **Terminal 2** để chạy Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

- Hệ thống sẽ chạy:
  - Frontend: `http://localhost:3002`
  - Backend: `http://localhost:3001`
  - MinIO GUI: `http://localhost:9001`

#### Cách 2: Chạy hoàn toàn 100% bằng Docker (Nhanh nhất)

Bạn không cần Node.js ở máy thật, chỉ cần chạy một lệnh duy nhất:

```bash
docker compose up -d --build
```

_Lưu ý:_ Khi chạy cách này, Backend sẽ nằm trong docker. Bạn cần chui vào trong Docker Container để chạy các lệnh quản lý Data, bằng cách:
`docker exec -it wos-backend sh` (Sau đó gõ các lệnh MikroORM như ở bên dưới).

---

## Danh sách câu lệnh cần thiết

### I. Lệnh Quản trị Cơ sở dữ liệu (MikroORM)

_(Lưu ý: Các lệnh này bắt buộc phải được gõ trong thư mục `backend`)_

- Mở terminal trong thư mục backend trước:
  ```bash
  cd backend
  ```
- **`npm run mg:create`**: Quét toàn bộ thay đổi ở Entities trong code Backend và tự động gen ra một file migration `.ts` (Chạy khi bạn thêm cột/bảng mới trong code).
- **`npm run mg:up`**: Cập nhật (Apply) toàn bộ các file migration mới nhất vào thực tế Database (Postgres). (Nên chạy sau mỗi lần pull code).
- **`npm run mg:down`**: Rollback, đảo ngược lại bản update database gần nhất (khi bị lỗi).
- **`npm run seed:all`**: Chạy toàn bộ các class Seed đã viết để tạo data mẫu test vào Database.
- **`npm run seed <Tên_Class>`**: Chạy đổ data cho class cụ thể (VD: `npm run seed UserSeeder`).

### II. Các lệnh Docker thiết yếu

- **`docker compose up -d`**: Khởi chạy dự án ngầm.
- **`docker compose up -d --build`**: Yêu cầu cài cắm lại từ đầu các thư viện rồi mới chạy (Thường dùng khi Backend/Frontend có người đổi `package.json`).
- **`docker compose down`**: Tạm tắt dự án.
- **`docker compose down -v`**: Tắt và **Xoá sạch sành sanh** dữ liệu cũ từ DB để dự án Trắng Tinh. (Rất có ích khi bị kẹt lỗi Cache/Passwords hồi trước).

### III. Lệnh Quản trị MinIO (Dùng khi cần tạo Bucket hoặc cấp quyền)

# 1. Khai báo quyền admin cho công cụ lệnh mc bên trong container

docker exec wos-minio mc alias set local http://localhost:9000 admin 12345678

# 2. Tạo một Service Access Key y xì đúc như trong file .env của backend

docker exec wos-minio mc admin user svcacct add local admin --access-key 2XuSk7s9ntfcAIZ0cfJH --secret-key oqyA5rWuNBJeKYAUvotc7p2bEwNb29gHfPieMVBX

# 3. Tạo sẵn Bucket có tên là wos-bucket

docker exec wos-minio mc mb local/wos-bucket

# 4. Phân quyền bucket thành download (public read) để Frontend hiện ảnh được

docker exec wos-minio mc anonymous set download local/wos-bucket
