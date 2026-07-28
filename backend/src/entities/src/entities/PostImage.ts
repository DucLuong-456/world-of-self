import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Post } from './Post';

@Entity({ tableName: 'post_images' })
export class PostImage extends CustomBaseEntityWithDeletedAt {
  @Property()
  path: string;

  @Property()
  ext: string;

  @Property({ type: 'int', default: 0 })
  sort_order: number;

  @ManyToOne({
    entity: () => Post,
    inversedBy: (post) => post.images,
    joinColumn: 'post_id',
  })
  post: Post;
}
