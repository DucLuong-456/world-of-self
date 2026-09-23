import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { CustomBaseEntity } from './CustomBaseEntity';
import type { InviteCode } from './InviteCode';
import { User } from './User';

@Entity({ tableName: 'invite_code_usages' })
export class InviteCodeUsage extends CustomBaseEntity {
  @PrimaryKey({ type: 'uuid', default: null })
  id: string = uuidv4();

  @Property({ type: 'uuid' })
  code_id: string;

  @Property({ type: 'uuid' })
  user_id: string;

  @ManyToOne({ entity: 'InviteCode', joinColumn: 'code_id', nullable: true })
  invite_code?: InviteCode;

  @ManyToOne({ entity: () => User, joinColumn: 'user_id', nullable: true })
  user?: User;
}
