import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { FriendshipStatus } from '@constants/friendshipStatus';

@Entity({ tableName: 'user_relationships' })
export class UserRelationship extends CustomBaseEntity {
  @PrimaryKey()
  @Property({ type: 'uuid' })
  user_id: string;

  @PrimaryKey()
  @Property({ type: 'uuid' })
  friend_id: string;

  @Enum(() => FriendshipStatus)
  status: FriendshipStatus;

  @Property({ type: 'timestamp', nullable: true })
  deletedAt = new Date();
}
