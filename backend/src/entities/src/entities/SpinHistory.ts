import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';

@Entity({ tableName: 'spin_histories' })
export class SpinHistory extends CustomBaseEntityWithDeletedAt {
  @Property({ type: 'uuid' })
  user_id: string;

  /** Số Ngọc thắng được */
  @Property({ type: 'int' })
  gems_earned: number;

  /** Index ô trúng (0-7) để frontend animate */
  @Property({ type: 'int' })
  slot_index: number;

  @ManyToOne({ entity: () => User, joinColumn: 'user_id', nullable: true })
  user?: User;
}
