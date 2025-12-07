import { FriendshipStatus } from '@constants/friendshipStatus';
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User';

@Entity({ tableName: 'user_relationships' })
export class UserRelationship extends CustomBaseEntity {
  @PrimaryKey()
  @Property({ type: 'uuid' })
  user_id: string;

  @PrimaryKey()
  @Property({ type: 'uuid' })
  friend_id: string;

  @Property({
    type: 'varchar',
    default: FriendshipStatus.PENDING,
    nullable: false,
  })
  status: FriendshipStatus;

  @Property({ type: 'timestamp', nullable: true, default: null })
  deleted_at: Date | null;

  @ManyToOne({
    entity: () => User,
    nullable: true,
    inversedBy: (user) => user.friends,
    joinColumn: 'user_id',
  })
  user!: User;

  @ManyToOne({
    entity: () => User,
    nullable: true,
    inversedBy: (user) => user.users,
    joinColumn: 'friend_id',
  })
  friend!: User;
}
