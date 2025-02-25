import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { UserWeeklyRankStatus } from '@constants/userWeeklyRankStatus';
import { User } from './User';

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

  @ManyToOne({
    entity: () => User,
    nullable: true,
    inversedBy: (user) => user.userWeeklyRankings,
    joinColumn: 'user_id',
  })
  user!: User;
}
