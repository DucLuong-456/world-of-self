import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { User } from '@entities/User';
import { Conversation } from '@entities/Conversation';
import { UserRole } from '@constants/userRole.enum';
import { Auth } from 'src/decorators/auth.decorator';

@Auth(UserRole.User)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations(
    @Req() req: Request,
  ): Promise<{ data: Conversation[] }> {
    const user = req.user as User;
    const data = await this.chatService.getConversations(user.id);
    return { data };
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @Param('id') conversationId: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    const { items, total } = await this.chatService.getMessages(
      conversationId,
      Number(limit),
      Number(offset),
    );
    return {
      data: items,
      paging: { limit: Number(limit), offset: Number(offset), total },
    };
  }

  @Get('conversations/:id/members')
  async getConversationMembers(@Param('id') conversationId: string) {
    const data = await this.chatService.getConversationMembers(conversationId);
    return { data };
  }

  @Post('conversations')
  async createConversation(
    @Req() req: Request,
    @Body('targetUserId') targetUserId: string,
  ) {
    const user = req.user as User;
    const data = await this.chatService.createConversation(
      user.id,
      targetUserId,
    );
    return { data, message: 'Conversation created successfully' };
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Req() req: Request,
    @Param('id') conversationId: string,
    @Body() body: { content: string; type?: string },
  ) {
    const user = req.user as User;
    const data = await this.chatService.sendMessage({
      conversationId,
      senderId: user.id,
      content: body.content,
      type: body.type,
    });
    return { data };
  }
}
