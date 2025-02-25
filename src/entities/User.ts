import { UserRole } from '@constants/userRole.enum';
import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Post } from './Post';
import { UserActivity } from './UserActivity';
import { UserWeeklyRankings } from './UserWeeklyRanking';

@Entity({ tableName: 'users' })
export class User extends CustomBaseEntityWithDeletedAt {
  @Property()
  user_name: string;

  @Property()
  email: string;

  @Property()
  phone: string;

  @Property()
  password: string;

  @Property()
  avatar: string;

  @Enum(() => UserRole)
  role: UserRole;

  @OneToMany({
    entity: () => UserActivity,
    mappedBy: (user_activity) => user_activity.user,
  })
  user_activities = new Collection<UserActivity>(this);

  @OneToMany({
    entity: () => Post,
    mappedBy: (post) => post.user,
  })
  posts = new Collection<Post>(this);

  @OneToMany({
    entity: () => UserWeeklyRankings,
    mappedBy: (userWeeklyRanking) => userWeeklyRanking.user,
  })
  userWeeklyRankings = new Collection<UserWeeklyRankings>(this);
}
