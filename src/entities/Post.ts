import { PostCategory } from '@constants/postCategory';
import { Entity, Enum, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';
import { StoredImage } from './StoredImage';

@Entity({ tableName: 'posts' })
export class Post extends CustomBaseEntityWithDeletedAt {
  @Property()
  image_id: string;

  @Property()
  title: string;

  @Property()
  react_count: number;

  @Property()
  user_id: string;

  @Enum(() => PostCategory)
  category: PostCategory;

  @ManyToOne({
    entity: () => User,
    nullable: true,
    inversedBy: (user) => user.posts,
    joinColumn: 'activity_id',
  })
  user!: User;

  @OneToOne(() => StoredImage, (image) => image.post, { owner: true })
  image: StoredImage;
}
