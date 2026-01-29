import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { User } from '@entities/User';
import { UserRole } from '@constants/userRole.enum';

export class UserIndexLabSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const batchSize = 5000;
    const totalRecords = 1000000;

    console.log(`Starting to seed ${totalRecords} users...`);

    for (let i = 0; i < totalRecords; i += batchSize) {
      const users: User[] = [];
      for (let j = 0; j < batchSize; j++) {
        const user = em.create(User, {
          user_name: faker.internet.username() + i + j,
          email: faker.internet.email().split('@')[0] + i + j + '@lab.com',
          avatar: faker.image.avatar(),
          password: 'password123',
          phone: faker.phone.number(),
          role: faker.helpers.arrayElement([UserRole.User, UserRole.Admin]),
        });
        users.push(user);
      }
      await em.persistAndFlush(users);
      em.clear(); // Clear identity map to keep memory usage low
      console.log(`Seeded ${i + batchSize} records...`);
    }

    console.log('Seeding completed!');
  }
}
