import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';
import { Item } from './Item';

export enum UserItemStatus {
  OWNED = 'owned',
  GIFTED = 'gifted',
}

@Entity({ tableName: 'user_items' })
export class UserItem extends CustomBaseEntityWithDeletedAt {
  @Property({ type: 'uuid' })
  user_id: string;

  @Property({ type: 'uuid' })
  item_id: string;

  @Property({ type: 'varchar', default: UserItemStatus.OWNED })
  status: UserItemStatus;

  @Property({ type: 'uuid', nullable: true, default: null })
  gifted_by: string | null;

  @ManyToOne({ entity: () => User, joinColumn: 'user_id', nullable: true })
  user?: User;

  @ManyToOne({ entity: () => Item, joinColumn: 'item_id', nullable: true })
  item?: Item;
}
