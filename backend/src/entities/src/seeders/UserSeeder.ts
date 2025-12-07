import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { User } from '@entities//User';
import { UserRole } from '@constants/userRole.enum';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users: User[] = [];
    for (let i = 0; i < 10; i++) {
      users.push(
        em.create(User, {
          user_name: faker.internet.username(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          password: faker.internet.password(),
          phone: faker.phone.number(),
          role: UserRole.User,
        }),
      );
    }
    await em.persistAndFlush(users);
  }
}
