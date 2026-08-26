import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Item, ItemRarity } from '../entities/Item';

export class ItemSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const items = [
      {
        name: 'Hoa Hồng Vàng',
        description:
          'Đóa hoa hồng vàng lấp lánh, biểu tượng của sự trân trọng và tình cảm.',
        image_url: '/items/golden_rose.png',
        gem_price: 100,
        rarity: ItemRarity.COMMON,
        is_active: true,
      },
      {
        name: 'Ngọc Lục Bảo',
        description:
          'Viên ngọc lục bảo huyền bí, chứa đựng năng lượng của đại dương sâu thẳm.',
        image_url: '/items/emerald_gem.png',
        gem_price: 500,
        rarity: ItemRarity.RARE,
        is_active: true,
      },
      {
        name: 'Vương Miện Pha Lê',
        description:
          'Chiếc vương miện pha lê lộng lẫy, chỉ dành cho những người đặc biệt nhất.',
        image_url: '/items/crystal_crown.png',
        gem_price: 2000,
        rarity: ItemRarity.EPIC,
        is_active: true,
      },
      {
        name: 'Rồng Huyền Thoại',
        description:
          'Con rồng vàng huyền thoại, biểu tượng của sức mạnh và uy quyền tối thượng.',
        image_url: '/items/legendary_dragon.png',
        gem_price: 9999,
        rarity: ItemRarity.LEGENDARY,
        is_active: true,
      },
    ];

    for (const itemData of items) {
      const existing = await em.findOne(Item, { name: itemData.name });
      if (!existing) {
        em.create(Item, itemData);
      }
    }

    await em.flush();
    console.log('✅ ItemSeeder: Seeded 4 items');
  }
}
