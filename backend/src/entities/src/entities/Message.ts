import { MessageType } from '@constants/chat.enum';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Conversation } from './Conversation';
import { User } from './User';
import { MessageAttachment } from './MessageAttachment';
import { MessageReaction } from './MessageReaction';

@Entity({ tableName: 'messages' })
export class Message extends CustomBaseEntityWithDeletedAt {
  @Property({ persist: false })
  get conversation_id(): string {
    return this.conversation?.id;
  }

  @Property({ persist: false })
  get sender_id(): string {
    return this.sender?.id;
  }

  @Property({ type: 'text', nullable: true, default: null })
  content?: string | null;

  @Property({ type: 'varchar', default: MessageType.TEXT })
  type: MessageType;

  @Property({ nullable: true, default: null })
  reply_to_id?: string | null;

  @ManyToOne({
    entity: () => Conversation,
    joinColumn: 'conversation_id',
    inversedBy: (c) => c.messages,
  })
  conversation!: Conversation;

  @ManyToOne({
    entity: () => User,
    joinColumn: 'sender_id',
  })
  sender!: User;

  @ManyToOne({
    entity: () => Message,
    nullable: true,
    joinColumn: 'reply_to_id',
  })
  reply_to?: Message | null;

  @OneToMany({
    entity: () => MessageAttachment,
    mappedBy: (attachment) => attachment.message,
  })
  attachments = new Collection<MessageAttachment>(this);

  @OneToMany({
    entity: () => MessageReaction,
    mappedBy: (reaction) => reaction.message,
  })
  reactions = new Collection<MessageReaction>(this);
}
