import { ActivityType } from '@constants/activityType.enum';
import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { UserActivity } from './UserActivity';

@Entity({ tableName: 'activities' })
export class Activity extends CustomBaseEntityWithDeletedAt {
  @Property()
  score: number;

  @Enum(() => ActivityType)
  type: ActivityType;

  @OneToMany({
    entity: () => UserActivity,
    mappedBy: (user_activity) => user_activity.activity,
  })
  user_activities = new Collection<UserActivity>(this);
}
