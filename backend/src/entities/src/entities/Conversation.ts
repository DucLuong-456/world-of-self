import { ConversationType } from '@constants/chat.enum';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { ConversationMember } from './ConversationMember';
import { Message } from './Message';

@Entity({ tableName: 'conversations' })
export class Conversation extends CustomBaseEntityWithDeletedAt {
  @Property({ type: 'varchar', default: ConversationType.DIRECT })
  type: ConversationType;

  @Property({ nullable: true, default: null })
  name?: string | null;

  @Property({ nullable: true, default: null })
  avatar_url?: string | null;

  @Property({ nullable: true, default: null })
  last_message_id?: string | null;

  @ManyToOne({
    entity: () => Message,
    nullable: true,
    joinColumn: 'last_message_id',
  })
  last_message?: Message | null;

  @OneToMany({
    entity: () => ConversationMember,
    mappedBy: (member) => member.conversation,
  })
  members = new Collection<ConversationMember>(this);

  @OneToMany({
    entity: () => Message,
    mappedBy: (message) => message.conversation,
  })
  messages = new Collection<Message>(this);
}
