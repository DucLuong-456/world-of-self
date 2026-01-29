import { PostCategory } from '@constants/postCategory';
import { User } from '@entities/User';
import { Post } from '@entities/Post';
import { StoredImage } from '@entities/StoredImage';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class PostSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const batchSize = 2000; // Giảm xuống 2000 vì mỗi user có thể có 5 posts (tổng ~10k records/batch)
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

      const imageDatas: any[] = [];
      const userPostMap: { userId: string; numPosts: number }[] = [];

      // 1. Chuẩn bị dữ liệu Image trước
      for (const user of users) {
        const numPosts = faker.number.int({ min: 1, max: 5 });
        userPostMap.push({ userId: user.id, numPosts });

        for (let j = 0; j < numPosts; j++) {
          imageDatas.push(
            em.create(StoredImage, {
              path: faker.image.url(),
              ext: 'jpg',
            }),
          );
        }
      }

      // 2. Upsert Images hàng loạt để lấy IDs
      // Lưu ý: upsertMany sẽ trả về các thực thể có ID nếu dùng Postgres
      const createdImages = await em.upsertMany(StoredImage, imageDatas);

      // 3. Chuẩn bị dữ liệu Post
      const postDatas: any[] = [];
      let imageIdx = 0;

      for (const item of userPostMap) {
        for (let j = 0; j < item.numPosts; j++) {
          const image = createdImages[imageIdx++];
          postDatas.push(
            em.create(Post, {
              title: faker.string.alphanumeric(10),
              react_count: 1,
              user_id: item.userId, // Khóa ngoại
              stored_image_id: image.id, // Khóa ngoại từ ảnh vừa tạo
              category: PostCategory.News,
              created_at: new Date(),
            }),
          );
        }
      }

      // 4. Upsert Posts hàng loạt
      await em.upsertMany(Post, postDatas);

      // 5. Giải phóng bộ nhớ cực kỳ quan trọng cho 1.1tr record
      em.clear();
    }

    console.log('Seeding completed!');
  }
}
