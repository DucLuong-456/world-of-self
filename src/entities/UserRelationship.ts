import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';

@Entity({ tableName: 'user_relationships' })
export class UserRelationship extends CustomBaseEntity {
  @PrimaryKey()
  @Property({ type: 'uuid', default: null })
  user_id: string;

  @PrimaryKey()
  @Property({ type: 'uuid', default: null })
  friend_id: string;

  @Property({ type: 'timestamp', nullable: true })
  deletedAt = new Date();
}
