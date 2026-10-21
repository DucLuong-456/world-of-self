import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';
import { Post } from './Post';

@Entity({ tableName: 'comments' })
export class Comment extends CustomBaseEntityWithDeletedAt {
  @Property({ type: 'text' })
  content: string;

  @Property({ type: 'uuid' })
  post_id: string;

  @Property({ type: 'uuid', nullable: true, default: null })
  parent_id: string | null;

  @Property({ type: 'uuid' })
  created_by: string;

  @ManyToOne({
    entity: () => Post,
    joinColumn: 'post_id',
  })
  post!: Post;

  @ManyToOne({
    entity: () => User,
    joinColumn: 'created_by',
  })
  user!: User;

  @ManyToOne({
    entity: () => Comment,
    nullable: true,
    joinColumn: 'parent_id',
  })
  parent!: Comment | null;

  @OneToMany({
    entity: () => Comment,
    mappedBy: (comment) => comment.parent,
  })
  replies = new Collection<Comment>(this);
}
