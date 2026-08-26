import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { UserItem } from './UserItem';

export enum ItemRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

@Entity({ tableName: 'items' })
export class Item extends CustomBaseEntityWithDeletedAt {
  @Property()
  name: string;

  @Property({ type: 'text', nullable: true, default: null })
  description: string | null;

  @Property({ nullable: true, default: null })
  image_url: string | null;

  @Property({ type: 'int' })
  gem_price: number;

  @Property({ type: 'varchar', default: ItemRarity.COMMON })
  rarity: ItemRarity;

  @Property({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany({ entity: () => UserItem, mappedBy: (ui) => ui.item })
  owners = new Collection<UserItem>(this);
}
