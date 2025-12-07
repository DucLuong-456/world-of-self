import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { User } from '@entities//User';
import { UserRole } from '@constants/userRole.enum';
import { UserRelationship } from '@entities/UserRelationship';
import { FriendshipStatus } from '@constants/friendshipStatus';

export class UserRelationshipSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // const users: User[] = [];
    // for (let i = 0; i < 10; i++) {
    //   users.push(
    //     em.create(User, {
    //       user_name: faker.internet.username(),
    //       email: faker.internet.email(),
    //       avatar: faker.image.avatar(),
    //       password: faker.internet.password(),
    //       phone: faker.phone.number(),
    //       role: UserRole.User,
    //     }),
    //   );
    // }
    // await em.persistAndFlush(users);
    const users = await em.find(User, {}, { limit: 10 });

    const newUser = em.create(User, {
      user_name: faker.internet.username(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      role: UserRole.User,
    });
    await em.persistAndFlush(newUser);

    if (users.length > 0) {
      for (const user of users) {
        const userRelationship = em.create(UserRelationship, {
          user_id: newUser.id,
          friend_id: user.id,
          status: FriendshipStatus.ACCEPTED,
        });
        await em.persistAndFlush(userRelationship);
      }
    }
  }
}
