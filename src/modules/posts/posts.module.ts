import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '@entities/Post';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@entities/User';
import { PostReact } from '@entities/PostReact';

@Module({
  imports: [MikroOrmModule.forFeature([User, Post, PostReact])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
