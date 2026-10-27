import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { Sticker } from './Sticker';

@Entity({ tableName: 'sticker_packs' })
export class StickerPack extends CustomBaseEntityWithDeletedAt {
  @Property()
  name: string;

  @Property({ type: 'text', nullable: true, default: null })
  description?: string | null;

  @Property({ type: 'text', nullable: true, default: null })
  icon_url?: string | null;

  @Property({ type: 'boolean', default: true })
  is_active: boolean = true;

  @Property({ type: 'integer', default: 0 })
  sort_order: number = 0;

  @OneToMany({
    entity: () => Sticker,
    mappedBy: (sticker) => sticker.pack,
  })
  stickers = new Collection<Sticker>(this);
}
