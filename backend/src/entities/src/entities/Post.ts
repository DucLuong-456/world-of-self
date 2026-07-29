import { PostCategory } from '@constants/postCategory';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';
import { PostReact } from './PostReact';
import { PostImage } from './PostImage';
import { PostTemplate } from './PostTemplate';

@Entity({ tableName: 'posts' })
export class Post extends CustomBaseEntityWithDeletedAt {
  @Property({ nullable: true, default: null })
  title: string;

  @Property({ persist: false })
  is_reacted?: boolean = false;

  @Property()
  content: string;

  @Property({ type: 'int', default: 0 })
  react_count: number;

  @Property()
  user_id: string;

  @Property({ type: 'varchar', nullable: true, default: null })
  category: PostCategory;

  @Property({ nullable: true, default: null })
  template_id: string | null;

  @ManyToOne({
    entity: () => User,
    nullable: true,
    inversedBy: (user) => user.posts,
    joinColumn: 'user_id',
  })
  user!: User;

  @ManyToOne({
    entity: () => PostTemplate,
    nullable: true,
    joinColumn: 'template_id',
  })
  template: PostTemplate | null;

  @OneToMany({
    entity: () => PostImage,
    mappedBy: (img) => img.post,
    orderBy: { sort_order: 'ASC' },
  })
  images = new Collection<PostImage>(this);

  @OneToMany({
    entity: () => PostReact,
    mappedBy: (post_react) => post_react.post,
  })
  post_react = new Collection<PostReact>(this);

  @OneToMany('Comment', 'post')
  comments = new Collection<any>(this);
}
