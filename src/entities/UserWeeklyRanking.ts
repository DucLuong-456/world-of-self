import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { UserWeeklyRankStatus } from '@constants/userWeeklyRankStatus';

@Entity({ tableName: 'user_weekly_rankings' })
export class UserWeeklyRankings extends CustomBaseEntityWithDeletedAt {
  @PrimaryKey({ type: 'uuid', default: null })
  user_id: string;
  @Property()
  start_date: string;

  @Property()
  total_score: number;

  @Property()
  rank: number;

  @Enum(() => UserWeeklyRankStatus)
  status: UserWeeklyRankStatus;
}
