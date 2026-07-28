import { PostCategory } from '@constants/postCategory';
import { User } from '@entities/User';
import { Post } from '@entities/Post';
import { PostImage } from '@entities/PostImage';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { v4 as uuidv4 } from 'uuid';

export class PostSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const batchSize = 2000;
    const totalUsers = await em.count(User);

    for (let i = 0; i < totalUsers; i += batchSize) {
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

      if (users.length === 0) break;
      console.log(`Processing user batch ${i} to ${i + users.length}`);

      const postDatas: any[] = [];
      const imageDatas: any[] = [];

      for (const user of users) {
        const numPosts = faker.number.int({ min: 1, max: 5 });

        for (let j = 0; j < numPosts; j++) {
          const postId = uuidv4();
          const post = em.create(Post, {
            id: postId,
            title: faker.string.alphanumeric(10),
            content: faker.lorem.sentence(),
            react_count: 1,
            user_id: user.id,
            category: PostCategory.News,
            created_at: new Date(),
          });
          postDatas.push(post);

          // Attach 1 fake image per post
          imageDatas.push(
            em.create(PostImage, {
              path: faker.image.url(),
              ext: 'jpg',
              post: post,
              sort_order: 0,
            }),
          );
        }
      }

      await em.upsertMany(Post, postDatas);
      await em.upsertMany(PostImage, imageDatas);
      em.clear();
    }

    console.log('Seeding completed!');
  }
}
