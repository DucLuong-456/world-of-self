import { Entity, OneToMany, Property, Collection } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Post } from './Post';

@Entity({ tableName: 'post_templates' })
export class PostTemplate extends CustomBaseEntityWithDeletedAt {
  @Property()
  name: string;

  @Property()
  bg_color: string; // CSS gradient or hex, e.g. 'linear-gradient(135deg, #f5af19, #f12711)'

  @Property()
  text_color: string; // e.g. '#ffffff'

  @Property({ nullable: true, default: null })
  font_style: string | null; // e.g. 'italic' or null

  @OneToMany({
    entity: () => Post,
    mappedBy: (post) => post.template,
  })
  posts = new Collection<Post>(this);
}
