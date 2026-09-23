import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';

@Entity({ tableName: 'daily_check_ins' })
export class DailyCheckIn extends CustomBaseEntityWithDeletedAt {
  @Property({ type: 'uuid' })
  user_id: string;

  /** Ngày điểm danh (chỉ lưu date, không có time) */
  @Property({ type: 'date' })
  checked_date: string;

  /** Streak liên tiếp tính đến ngày này */
  @Property({ type: 'int', default: 1 })
  streak: number;

  /** Số Ngọc nhận được */
  @Property({ type: 'int' })
  gems_earned: number;

  @ManyToOne({ entity: () => User, joinColumn: 'user_id', nullable: true })
  user?: User;
}
