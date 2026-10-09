import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Message } from './Message';

@Entity({ tableName: 'message_attachments' })
export class MessageAttachment extends CustomBaseEntityWithDeletedAt {
  @Property()
  message_id: string;

  @Property({ type: 'text' })
  file_url: string;

  @Property({ type: 'varchar', nullable: true })
  file_type?: string | null;

  @Property({ type: 'varchar', nullable: true })
  file_name?: string | null;

  @Property({ type: 'int', nullable: true })
  file_size?: number | null;

  @ManyToOne({
    entity: () => Message,
    joinColumn: 'message_id',
    inversedBy: (m) => m.attachments,
  })
  message!: Message;
}
