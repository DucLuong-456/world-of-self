import { PostCategory } from '@constants/postCategory';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { StoredImage } from './StoredImage';
import { User } from './User';
import { PostReact } from './PostReact';

@Entity({ tableName: 'posts' })
export class Post extends CustomBaseEntityWithDeletedAt {
  @Property()
  stored_image_id: string;

  @Property()
  title: string;

  @Property({ type: 'int', default: 0 })
  react_count: number;

  @Property()
  user_id: string;

  @Property({ type: 'varchar', nullable: true, default: null })
  category: PostCategory;

  @ManyToOne({
    entity: () => User,
    nullable: true,
    inversedBy: (user) => user.posts,
    joinColumn: 'activity_id',
  })
  user!: User;

  @OneToOne({
    entity: () => StoredImage,
    nullable: true,
    inversedBy: (storedImage) => storedImage.post,
    joinColumn: 'stored_image_id',
  })
  image: StoredImage;

  @OneToMany({
    entity: () => PostReact,
    mappedBy: (post_react) => post_react.post,
  })
  post_react = new Collection<PostReact>(this);
}
