---
name: create_websocket_gateway
description: Hướng dẫn tạo chuẩn NestJS WebSocket Gateway (Socket.io) kèm JWT Auth, Room management và Exception Filter.
---

# Kỹ năng Tạo WebSocket Gateway (NestJS)

Khi yêu cầu phát triển một tính năng tương tác Realtime thông qua WebSocket, hãy tuân thủ các bước sau để xây dựng Gateway:

## 1. Cài đặt các gói phụ thuộc (nếu chưa có)
Kiểm tra xem dự án đã cài đặt `@nestjs/websockets` và `@nestjs/platform-socket.io` hay chưa. Nếu chưa, hãy cài đặt.

## 2. Cấu trúc Gateway chuẩn
Mỗi module yêu cầu realtime (ví dụ: `chat`) nên có một Gateway riêng biệt.
Tạo file `chat.gateway.ts` bên trong module tương ứng.

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*', // Thay đổi tuỳ theo config thực tế
  },
  namespace: '/chat', // Khuyến nghị sử dụng namespace
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Sử dụng một Map/Redis để theo dõi Presence (User Online Status)
  private readonly connectedUsers = new Map<string, string[]>(); // userId -> socketIds[]

  handleConnection(client: Socket) {
     // Khởi tạo trạng thái connection (Lưu ý: Auth thường được xử lý thông qua Guard/Middleware tuỳ kiến trúc)
  }

  handleDisconnect(client: Socket) {
     // Cập nhật trạng thái Offline, dọn dẹp Map
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chat:join_room')
  handleJoinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
     client.join(`room_${data.roomId}`);
     return { status: 'success', data: { roomId: data.roomId } };
  }
}
```

## 3. Quản lý Authentication
Luôn bảo vệ các Endpoint WebSocket.
Sử dụng `WsJwtGuard` (kế thừa từ `AuthGuard('jwt')` nhưng được điều chỉnh để lấy Token từ `client.handshake.headers` hoặc `client.handshake.auth`).

## 4. Báo cáo lại cho User
- Mô tả sơ lược các Event đã được định nghĩa.
- Giải thích cấu trúc Payload/Response (theo quy tắc `websocket_conventions.md`).
