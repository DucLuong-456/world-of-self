import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Message } from './Message';
import { User } from './User';

@Entity({ tableName: 'message_reactions' })
export class MessageReaction extends CustomBaseEntityWithDeletedAt {
  @Property()
  message_id: string;

  @Property()
  user_id: string;

  @Property({ type: 'varchar' })
  emoji: string;

  @ManyToOne({
    entity: () => Message,
    joinColumn: 'message_id',
    inversedBy: (m) => m.reactions,
  })
  message!: Message;

  @ManyToOne({
    entity: () => User,
    joinColumn: 'user_id',
  })
  user!: User;
}
