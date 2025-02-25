import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User';
import { Activity } from './Activity';

@Entity({ tableName: 'user_activities' })
export class UserActivity extends CustomBaseEntity {
  @PrimaryKey({ type: 'uuid' })
  user_id: string;

  @PrimaryKey({ type: 'uuid' })
  activity_id: string;

  @Property()
  date: string;

  @ManyToOne({
    entity: () => User,
    nullable: true,
    inversedBy: (user) => user.user_activities,
    joinColumn: 'user_id',
  })
  user!: User;

  @ManyToOne({
    entity: () => Activity,
    nullable: true,
    inversedBy: (activity) => activity.user_activities,
    joinColumn: 'activity_id',
  })
  activity!: Activity;
}
