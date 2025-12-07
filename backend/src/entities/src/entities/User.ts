import { UserRole } from '@constants/userRole.enum';
import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Post } from './Post';
import { PostReact } from './PostReact';
import { UserRelationship } from './UserRelationship';

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
    entity: () => Post,
    mappedBy: (post) => post.user,
  })
  posts = new Collection<Post>(this);

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
