import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '@entities/Post';
import { PostImage } from '@entities/PostImage';
import { PostTemplate } from '@entities/PostTemplate';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@entities/User';
import { PostReact } from '@entities/PostReact';
import { UserProfile } from '@entities/UserProfile';
import { MinioModule } from '@modules/minio/minio.module';
import { BullModule } from '@nestjs/bull';
import { QueueName } from '../../queue/queueName.enum';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      User,
      UserProfile,
      Post,
      PostReact,
      PostImage,
      PostTemplate,
    ]),
    MinioModule,
    BullModule.registerQueue({
      name: QueueName.AiQueue,
    }),
    QueueModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
