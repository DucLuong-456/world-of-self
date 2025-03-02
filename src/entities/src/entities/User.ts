import { UserRole } from '@constants/userRole.enum';
import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Post } from './Post';
import { UserActivity } from './UserActivity';
import { UserRelationship } from './UserRelationship';
import { UserWeeklyRankings } from './UserWeeklyRanking';
import { PostReact } from './PostReact';

@Entity({ tableName: 'users' })
export class User extends CustomBaseEntityWithDeletedAt {
  @Property()
  user_name: string;

  @Property()
  email: string;

  @Property({ nullable: true, default: null })
  phone: string;

  @Property()
  password: string;

  @Property({ nullable: true, default: null })
  avatar: string;

  @Property({ type: 'varchar', default: UserRole.User })
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

  @OneToMany({ entity: () => UserRelationship, mappedBy: (ur) => ur.user })
  friends = new Collection<UserRelationship>(this);

  @OneToMany({ entity: () => UserRelationship, mappedBy: (ur) => ur.friend })
  users = new Collection<UserRelationship>(this);

  @OneToMany({
    entity: () => PostReact,
    mappedBy: (post_react) => post_react.user,
  })
  post_react = new Collection<PostReact>(this);
}
