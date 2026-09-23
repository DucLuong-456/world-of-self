import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ItemSeeder } from './ItemSeeder';
import { InviteCodeSeeder } from './InviteCodeSeeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await this.call(em, [ItemSeeder, InviteCodeSeeder]);
  }
}
