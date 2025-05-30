import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Post } from './Post';
import { User } from './User';
import { Emotion } from '@constants/emotion.enum';

@Entity({ tableName: 'post_reacts' })
export class PostReact extends CustomBaseEntity {
  @PrimaryKey()
  @Property({ type: 'uuid' })
  user_id: string;

  @PrimaryKey()
  @Property({ type: 'uuid' })
  post_id: string;

  @Property({ type: 'varchar', nullable: true, default: Emotion.Like })
  emotion: Emotion;

  @ManyToOne({
    entity: () => User,
    nullable: true,
    inversedBy: (user) => user.post_react,
    joinColumn: 'user_id',
  })
  user!: User;

  @ManyToOne({
    entity: () => Post,
    nullable: true,
    inversedBy: (post) => post.post_react,
    joinColumn: 'post_id',
  })
  post!: Post;
}
