import { User } from '@entities/User';
import { UserProfile } from '@entities/UserProfile';
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class UserProfileSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const batchSize = 5000;
    const totalRecords = await em.count(User);
    for (let i = 0; i < totalRecords; i += batchSize) {
      const users = await em.find(
        User,
        {},
        {
          orderBy: { created_at: 'ASC' },
          fields: ['id'],
          limit: batchSize,
          offset: i,
        },
      );
      if (users.length === 0) {
        break;
      }

      console.log('Processing batch', i, 'to', i + users.length);
      const dataToUpdate = users.map((user) =>
        em.create(UserProfile, {
          user_id: user.id,
        }),
      );

      await em.upsertMany(UserProfile, dataToUpdate, {
        onConflictFields: ['user_id'],
        onConflictAction: 'merge',
      });

      em.clear();
      if (users.length < batchSize) {
        break;
      }
    }
    console.log('Seeding completed!');
  }
}
