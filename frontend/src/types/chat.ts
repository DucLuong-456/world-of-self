import { User } from './user';

export enum MessageType {
  TEXT = 'TEXT',
  MEDIA = 'MEDIA',
  SYSTEM = 'SYSTEM',
}

export type Message = {
  id: string; // Có thể là temp_id lúc gửi
  temp_id?: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  type: MessageType;
  created_at: string;
  sender?: User;
  isTemp?: boolean;
};

export type Conversation = {
  id: string;
  type: 'DIRECT' | 'GROUP';
  name: string | null;
  avatar_url: string | null;
  last_message?: Message | null;
};

export interface SocketSuccessResponse<T> {
  status: 'success';
  data: T;
  message?: string;
}

export interface SocketErrorResponse {
  status: 'error';
  data?: never;
  message?: string;
}

export type SocketResponse<T> = SocketSuccessResponse<T> | SocketErrorResponse;

export interface JoinRoomResponseData {
  roomId: string;
}
