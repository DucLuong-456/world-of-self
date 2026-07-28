---
description: Dự án World Of Self chạy môi trường và cài đặt thế nào
---

# Workflow Setup Project / Chạy môi trường Develop

// turbo-all

1. Chạy các dịch vụ cơ sở hạ tầng (Database, Minio, Redis) thông qua docker-compose (chạy cho thư mục gốc của workspace).

```bash
docker compose up -d postgres redis minio
```

2. Kiểm tra xem các container đã start thành công hay chưa:

```bash
docker ps
```

3. Vào Backend và cài đặt Dependencies, khởi động Server:

```bash
cd backend && npm install
npm run mg:up
# Mở một service ngầm để chạy backend dev server.
```

_(Lưu ý: Đối với Frontend, thông thường sẽ chạy `npm install` và `npm run dev` ở thư mục frontend ở một tab console khác do tính chất theo dõi UI tĩnh)._
