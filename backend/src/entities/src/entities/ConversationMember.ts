import { ConversationMemberRole } from '@constants/chat.enum';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Conversation } from './Conversation';
import { User } from './User';
import { Message } from './Message';

@Entity({ tableName: 'conversation_members' })
export class ConversationMember extends CustomBaseEntityWithDeletedAt {
  @Property({ persist: false })
  get conversation_id(): string {
    return this.conversation?.id;
  }

  @Property({ persist: false })
  get user_id(): string {
    return this.user?.id;
  }

  @Property({ type: 'varchar', default: ConversationMemberRole.MEMBER })
  role: ConversationMemberRole;

  @Property({ nullable: true, default: null })
  last_read_message_id?: string | null;

  @Property({ type: 'timestamp' })
  joined_at: Date = new Date();

  @ManyToOne({
    entity: () => Conversation,
    joinColumn: 'conversation_id',
    inversedBy: (c) => c.members,
  })
  conversation!: Conversation;

  @ManyToOne({
    entity: () => User,
    joinColumn: 'user_id',
  })
  user!: User;

  @ManyToOne({
    entity: () => Message,
    nullable: true,
    joinColumn: 'last_read_message_id',
  })
  last_read_message?: Message | null;
}
