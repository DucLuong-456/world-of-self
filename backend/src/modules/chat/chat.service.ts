import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  EntityManager,
  RequestContext,
  wrap,
} from '@mikro-orm/core';
import { Conversation } from '@entities/Conversation';
import { ConversationMember } from '@entities/ConversationMember';
import { Message } from '@entities/Message';
import { User } from '@entities/User';
import {
  ConversationType,
  ConversationMemberRole,
  MessageType,
} from '@constants/chat.enum';
import { MinioService } from '../minio/minio.service';
import { BUCKET_NAME } from '../minio/minio.config';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: EntityRepository<Conversation>,
    @InjectRepository(ConversationMember)
    private readonly memberRepo: EntityRepository<ConversationMember>,
    @InjectRepository(Message)
    private readonly messageRepo: EntityRepository<Message>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    private readonly minioService: MinioService,
    private readonly em: EntityManager,
  ) {}

  async getConversations(userId: string): Promise<Conversation[]> {
    const members = await this.memberRepo.find(
      { user: { id: userId } },
      {
        populate: [
          'conversation',
          'conversation.last_message',
          'conversation.members.user',
        ],
      },
    );
    return Promise.all(
      members.map(async (m) => {
        const conv = m.conversation;
        if (conv.type === ConversationType.DIRECT) {
          const otherMember = conv.members
            .getItems()
            .find((mem) => mem.user.id !== userId);
          if (otherMember?.user) {
            conv.name = otherMember.user.user_name;
            conv.avatar_url = await this.minioService.getFileUrl(
              BUCKET_NAME,
              otherMember.user.avatar,
            );
          }
        } else if (conv.avatar_url) {
          conv.avatar_url = await this.minioService.getFileUrl(
            BUCKET_NAME,
            conv.avatar_url,
          );
        }
        return conv;
      }),
    );
  }

  async getMessages(conversationId: string, limit = 20, offset = 0) {
    const [items, total] = await this.messageRepo.findAndCount(
      { conversation: { id: conversationId } },
      {
        populate: ['sender'],
        orderBy: { created_at: 'DESC' },
        limit,
        offset,
      },
    );
    await Promise.all(
      items.map(async (msg) => {
        if (msg.sender?.avatar) {
          msg.sender.avatar = await this.minioService.getFileUrl(
            BUCKET_NAME,
            msg.sender.avatar,
          );
        }
      }),
    );
    return { items, total };
  }

  async createConversation(
    userId: string,
    targetUserId: string,
  ): Promise<Conversation> {
    // Check if DIRECT conversation already exists between these 2 users
    const myMemberships = await this.memberRepo.find(
      {
        user: { id: userId },
        conversation: { type: ConversationType.DIRECT },
      },
      { populate: ['conversation', 'conversation.members.user'] },
    );

    for (const m of myMemberships) {
      const hasTarget = m.conversation.members
        .getItems()
        .some((mem) => mem.user.id === targetUserId);
      if (hasTarget) {
        const conv = m.conversation;
        const otherMember = conv.members
          .getItems()
          .find((mem) => mem.user.id !== userId);
        if (otherMember?.user) {
          conv.name = otherMember.user.user_name;
          conv.avatar_url = await this.minioService.getFileUrl(
            BUCKET_NAME,
            otherMember.user.avatar,
          );
        }
        return conv;
      }
    }

    const conversation = this.conversationRepo.create({
      type: ConversationType.DIRECT,
    });

    const member1 = this.memberRepo.create({
      conversation,
      user: this.userRepo.getReference(userId),
      role: ConversationMemberRole.ADMIN,
    });

    const member2 = this.memberRepo.create({
      conversation,
      user: this.userRepo.getReference(targetUserId),
      role: ConversationMemberRole.MEMBER,
    });

    this.em.persist([conversation, member1, member2]);
    await this.em.flush();

    // Populate target user info for friendly display name & avatar
    const targetUser = await this.userRepo.findOne(targetUserId);
    if (targetUser) {
      conversation.name = targetUser.user_name;
      conversation.avatar_url = await this.minioService.getFileUrl(
        BUCKET_NAME,
        targetUser.avatar,
      );
    }

    return conversation;
  }

  async sendMessage(payload: {
    conversationId: string;
    senderId: string;
    content: string;
    type?: string;
    tempId?: string;
  }) {
    return RequestContext.create(this.em, async () => {
      const { conversationId, senderId, content, type, tempId } = payload;

      // Verify the sender is a member of the conversation
      const membership = await this.memberRepo.findOne({
        conversation: { id: conversationId },
        user: { id: senderId },
      });

      if (!membership) {
        throw new NotFoundException(
          'You are not a member of this conversation',
        );
      }

      const message = this.messageRepo.create({
        conversation: this.conversationRepo.getReference(conversationId),
        sender: this.userRepo.getReference(senderId),
        content,
        type: (type as MessageType) || MessageType.TEXT,
      });

      // Update last_message on conversation
      const conversation =
        await this.conversationRepo.findOneOrFail(conversationId);
      conversation.last_message = message;

      await this.em.persistAndFlush([conversation, message]);

      // Populate sender info before returning
      await this.em.populate(message, ['sender']);
      if (message.sender?.avatar) {
        message.sender.avatar = await this.minioService.getFileUrl(
          BUCKET_NAME,
          message.sender.avatar,
        );
      }

      // Return message with temp_id so the client can match the optimistic update
      return {
        ...wrap(message).toObject(),
        conversation_id: conversationId,
        sender_id: senderId,
        temp_id: tempId,
      };
    });
  }

  async markAsRead(userId: string, conversationId: string, messageId: string) {
    return RequestContext.create(this.em, async () => {
      const member = await this.memberRepo.findOne({
        user: { id: userId },
        conversation: { id: conversationId },
      });

      if (!member) {
        throw new NotFoundException(
          'You are not a member of this conversation',
        );
      }

      member.last_read_message_id = messageId;
      await this.em.flush();
    });
  }

  async getConversationMembers(conversationId: string) {
    return this.memberRepo.find(
      { conversation: { id: conversationId } },
      { populate: ['user'] },
    );
  }
}
