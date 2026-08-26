import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { InviteCode } from '../entities/InviteCode';

export class InviteCodeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const codes = [
      {
        code: 'TANTHU',
        gem_reward: 500,
        is_active: true,
        max_uses: -1, // vô hạn
        used_count: 0,
        created_by: null,
      },
    ];

    for (const codeData of codes) {
      const existing = await em.findOne(InviteCode, { code: codeData.code });
      if (!existing) {
        em.create(InviteCode, codeData);
      }
    }

    await em.flush();
    console.log('✅ InviteCodeSeeder: Seeded invite codes');
  }
}
