import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { StickerPack } from './StickerPack';

@Entity({ tableName: 'stickers' })
export class Sticker extends CustomBaseEntityWithDeletedAt {
  @ManyToOne({
    entity: () => StickerPack,
    inversedBy: (pack) => pack.stickers,
    deleteRule: 'cascade',
  })
  pack: StickerPack;

  @Property({ persist: false })
  get pack_id(): string {
    return this.pack?.id;
  }

  @Property({ nullable: true, default: null })
  name?: string | null;

  @Property({ type: 'text' })
  image_url: string;

  @Property({ type: 'integer', default: 0 })
  sort_order: number = 0;
}
