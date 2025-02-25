import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Post } from './Post';

@Entity({ tableName: 'stored_images' })
export class StoredImage extends CustomBaseEntityWithDeletedAt {
  @Property()
  path: string;

  @Property()
  ext: string;

  @OneToOne(() => Post, (post) => post.image)
  post: Post;
}
