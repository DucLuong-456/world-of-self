import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Conversation } from '@entities/Conversation';
import { ConversationMember } from '@entities/ConversationMember';
import { Message } from '@entities/Message';
import { User } from '@entities/User';

import { WsJwtGuard } from '../auth/guard/ws-jwt.guard';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Conversation,
      ConversationMember,
      Message,
      User,
    ]),
    MinioModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, WsJwtGuard],
  exports: [ChatGateway, ChatService],
})
export class ChatModule {}
