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
import { WsJwtGuard, AuthenticatedSocket } from '../auth/guard/ws-jwt.guard';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.onAny((event, ...args) => {
      console.log(`[Socket ${client.id}] Event received: ${event}`, args);
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chat:join_room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!data?.roomId) {
      return { status: 'error', message: 'roomId is required' };
    }

    client.join(`room_${data.roomId}`);
    console.log(`Socket ${client.id} joined room_${data.roomId}`);
    return { status: 'success', data: { roomId: data.roomId } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chat:leave_room')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!data?.roomId) {
      return { status: 'error', message: 'roomId is required' };
    }

    client.leave(`room_${data.roomId}`);
    return { status: 'success', data: { roomId: data.roomId } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chat:send_message')
  async handleSendMessage(
    @MessageBody()
    data: {
      conversation_id: string;
      content: string;
      type?: string;
      temp_id?: string;
    },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      console.log(
        `Received chat:send_message for conv: ${data.conversation_id}`,
      );
      const user = client.user;
      if (!user) {
        return { status: 'error', message: 'Unauthorized' };
      }

      const message = await this.chatService.sendMessage({
        conversationId: data.conversation_id,
        senderId: user.id,
        content: data.content,
        type: data.type,
        tempId: data.temp_id,
      });

      // Broadcast to all clients in the room (except sender)
      client.to(`room_${data.conversation_id}`).emit('chat:message_received', {
        status: 'success',
        data: message,
      });

      // Ack back to sender with the confirmed message
      return { status: 'success', data: message };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send message';
      console.error('Error sending message:', errorMessage);
      return {
        status: 'error',
        message: errorMessage,
      };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chat:typing')
  handleTyping(
    @MessageBody() data: { conversation_id: string; is_typing: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const user = client.user;
    if (!user || !data?.conversation_id) {
      return { status: 'error', message: 'Invalid payload' };
    }

    // Broadcast typing indicator to other room members
    client.to(`room_${data.conversation_id}`).emit('chat:user_typing', {
      status: 'success',
      data: {
        user_id: user.id,
        user_name: user.user_name,
        conversation_id: data.conversation_id,
        is_typing: data.is_typing,
      },
    });

    return { status: 'success' };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chat:read_receipt')
  async handleReadReceipt(
    @MessageBody()
    data: { conversation_id: string; message_id: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const user = client.user;
      if (!user || !data?.conversation_id || !data?.message_id) {
        return { status: 'error', message: 'Invalid payload' };
      }

      await this.chatService.markAsRead(
        user.id,
        data.conversation_id,
        data.message_id,
      );

      // Notify other users in the room about the read receipt
      client.to(`room_${data.conversation_id}`).emit('chat:message_read', {
        status: 'success',
        data: {
          user_id: user.id,
          conversation_id: data.conversation_id,
          last_read_message_id: data.message_id,
        },
      });

      return { status: 'success' };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to mark as read';
      return {
        status: 'error',
        message: errorMessage,
      };
    }
  }
}
