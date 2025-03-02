import { PostCategory } from '@constants/postCategory';
import { User } from '@entities//User';
import { Post } from '@entities/Post';
import { StoredImage } from '@entities/StoredImage';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class PostSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = await em.find(User, {});
    const posts: Post[] = [];
    for (const user of users) {
      for (let j = 0; j < 5; j++) {
        const storedImage = em.create(StoredImage, {
          path: faker.image.url(),
          ext: 'jpg',
        });
        await em.persistAndFlush(storedImage);
        posts.push(
          em.create(Post, {
            title: faker.string.alphanumeric(10),
            react_count: 1,
            user: user,
            user_id: user.id,
            stored_image_id: storedImage.id,
            category: PostCategory.News,
            image: storedImage,
          }),
        );
      }
    }
    await em.persistAndFlush(posts);
  }
}
