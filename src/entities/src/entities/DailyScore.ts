import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseWithPrimaryKey } from './BaseWithPrimaryKey';

@Entity({ tableName: 'daily_scores' })
export class DailyScore extends BaseWithPrimaryKey {
  @PrimaryKey({ type: 'uuid' })
  user_id: string;

  @Property({ unique: true })
  date: string;

  @Property({ type: 'int', default: 0 })
  total_points: number;
}
