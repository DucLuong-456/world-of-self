import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageType } from '@constants/chat.enum';

export class SendMessageDto {
  @ApiProperty({ description: 'Nội dung tin nhắn hoặc đường dẫn/URL sticker' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    enum: MessageType,
    default: MessageType.TEXT,
    description: 'Loại tin nhắn (TEXT, MEDIA, STICKER, SYSTEM)',
  })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;
}

export class WsSendMessageDto extends SendMessageDto {
  @ApiProperty({ description: 'ID cuộc trò chuyện' })
  @IsNotEmpty()
  @IsString()
  conversation_id: string;

  @ApiPropertyOptional({ description: 'ID tạm thời phục vụ Optimistic UI' })
  @IsOptional()
  @IsString()
  temp_id?: string;
}

