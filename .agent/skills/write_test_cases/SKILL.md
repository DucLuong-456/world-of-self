---
name: write_test_cases
description: >-
  Thiết kế ma trận kịch bản kiểm thử (Test Matrix) và viết Unit/Integration Test
  (*.spec.ts) cho các tính năng trong dự án (NestJS, MikroORM, WebSocket, NextJS).
  Sử dụng khi User yêu cầu lập quy trình kiểm thử, viết test case, hoặc viết unit test
  cho một chức năng.
---

# Kỹ năng Thiết kế Test Case & Viết Unit Test (Write Test Cases Skill)

Khi được yêu cầu lập kịch bản kiểm thử hoặc viết test cho một tính năng mới, Agent phải tuân thủ quy trình 4 bước sau:

## Bước 1: Phân tích phạm vi kiểm thử (Test Scope)
Xác định các thành phần của tính năng:
1. **Database / Migration**: Bảng mới, cột mới, khóa ngoại (`ON DELETE CASCADE`), soft delete (`deleted_at`).
2. **Backend Service / Controller**: Logic nghiệp vụ, tích hợp MinIO/S3, phân quyền `@Auth(UserRole...)`, validation DTO.
3. **WebSocket Gateway (nếu có)**: Xác thực `WsJwtGuard`, join/leave room, emit/ack payload.
4. **Frontend UI & State**: Hiển thị dữ liệu, form validation, Optimistic Update & Deduplication (`temp_id`).

## Bước 2: Thiết kế Ma trận Kịch bản Kiểm thử (Test Matrix)
Luôn lập bảng Test Cases bao phủ đủ **4 nhóm bắt buộc**:

| Mã TC | Phân hệ | Nhóm | Kịch bản kiểm thử | Đầu vào (Input) | Kết quả mong đợi (Expected Output) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-01` | Backend API | **1. Happy Path** | Luồng thành công chuẩn | Payload hợp lệ + đúng Role | HTTP 200/201, lưu DB & trả về `{ data }` đúng cấu trúc |
| `TC-02` | Backend API | **2. Validation & Edge Cases** | Thiếu trường bắt buộc / ID không tồn tại / File rỗng | Payload lỗi hoặc ID giả | HTTP 400 (`ValidationPipe`) hoặc HTTP 404 (`NotFoundException`) |
| `TC-03` | Auth / Guard | **3. Permission (RBAC)** | Không có token hoặc sai Role (`user` gọi API `admin`) | Token `role='user'` | HTTP 401 Unauthorized hoặc HTTP 403 Forbidden |
| `TC-04` | Frontend / WS | **4. Realtime & State** | Gửi dữ liệu realtime (Optimistic UI & Deduplication) | Thao tác gửi trên UI | Hiển thị ngay với `temp_id`, khi Ack về thì thay thế bản ghi tạm mà không bị trùng lặp |

## Bước 3: Viết Unit Test Jest cho Backend (`*.spec.ts`)
Khi viết file unit test trong `backend/src/modules/<module>/<name>.service.spec.ts`:

### Quy tắc bắt buộc:
1. **Không dùng `any` (`no_any.md`)**: Định nghĩa kiểu rõ ràng cho các mock repository và service (dùng `jest.Mocked<Partial<...>>`).
2. **Mock MikroORM & MinioService chuẩn**:
   - Dùng `getRepositoryToken(Entity)` từ `@mikro-orm/nestjs`.
   - Mock `EntityManager` (`persistAndFlush`, `flush`, `removeAndFlush`, `populate`).
   - Mock `MinioService` (`uploadFile`, `getFileUrl`, `deleteFile`) để test chạy độc lập, nhanh và không cần kết nối S3 thật.

### Mẫu chuẩn (Template) cho Service Unit Test:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { MinioService } from '@modules/minio/minio.service';

describe('FeatureService', () => {
  let service: FeatureService;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    getReference: jest.fn(),
  };

  const mockEm = {
    persist: jest.fn(),
    persistAndFlush: jest.fn(),
    flush: jest.fn(),
    removeAndFlush: jest.fn(),
    populate: jest.fn(),
  };

  const mockMinioService = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureService,
        { provide: getRepositoryToken(MyEntity), useValue: mockRepo },
        { provide: EntityManager, useValue: mockEm },
        { provide: MinioService, useValue: mockMinioService },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## Bước 4: Chạy Kiểm thử & Báo cáo
1. Thực thi lệnh chạy test:
   ```bash
   cd backend && npm run test -- <tên_file_spec>
   ```
2. Đảm bảo tất cả các test suite đều **PASS** và báo cáo lại kết quả kèm hướng dẫn kiểm thử thủ công (Manual E2E steps) cho User.

