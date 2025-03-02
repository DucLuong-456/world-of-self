import { Post } from '@entities/Post';
import { PostReact } from '@entities/PostReact';
import { StoredImage } from '@entities/StoredImage';
import { User } from '@entities/User';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Post)
    private readonly postRepository: EntityRepository<Post>,
    @InjectRepository(PostReact)
    private readonly postReactRepository: EntityRepository<PostReact>,
    private em: EntityManager,
    @Inject(REQUEST) protected request: Request,
  ) {}

  async getPosts(data: SearchPostDto) {
    const limit = data?.limit || 5;
    const page = data?.page || 1;

    // get my posts
    // const userId = (this.request.user as User)?.id;

    const whereCondition = {};
    if (data.keyword) {
      whereCondition['title'] = { $ilike: `%${data.keyword}%` };
    }
    if (data.userId) {
      whereCondition['user_id'] = data.userId;
    }
    const [posts, totalCount] = await this.postRepository.findAndCount(
      { ...whereCondition },
      {
        limit: limit,
        offset: (page - 1) * limit,
        orderBy: { createdAt: 'DESC' },
        populate: ['user', 'image'],
      },
    );

    return {
      posts,
      paging: {
        limit: limit,
        page: page,
        totalCount,
      },
    };
  }

  async getPost(postId: string) {
    return this.postRepository.findOne(
      { id: postId },
      { populate: ['user', 'image'] },
    );
  }

  async create(data: CreatePostDto) {
    const userId = (this.request.user as User)?.id;

    let storedImage: StoredImage;
    if (data.image_metadata) {
      storedImage = this.em.create(StoredImage, {
        path: data.image_metadata.path,
        ext: data.image_metadata.ext,
      });
      await this.em.persistAndFlush(storedImage);
    }

    const post = this.postRepository.create({
      ...data,
      stored_image_id: storedImage?.id,
      user_id: userId,
      user: this.request.user,
      image: storedImage,
    });
    await this.em.persistAndFlush(post);

    return post;
  }

  async toggleReact(postId: string) {
    const userId = (this.request.user as User)?.id;
    const post = await this.postRepository.findOneOrFail({
      id: postId,
    });

    let postReact = await this.postReactRepository.findOne(
      {
        post_id: postId,
        user_id: userId,
      },
      {
        fields: ['user_id', 'post_id', 'createdAt', 'updatedAt'],
      },
    );

    await this.em.begin();
    try {
      if (!postReact) {
        postReact = this.postReactRepository.create({
          post_id: postId,
          user_id: userId,
        });
        post.react_count = post.react_count + 1;
      } else {
        await this.em.removeAndFlush(postReact);
        post.react_count = post.react_count - 1;
      }
      await this.em.persistAndFlush(post);

      await this.em.commit();
    } catch (error) {
      await this.em.rollback();
      throw new NotFoundException('Post react roll back');
    }
    //{ persist: false }: Đảm bảo user và post không tự động lưu hoặc populate trừ khi bạn yêu cầu.
    //@ManyToOne(() => Post, { persist: false })
    // post!: Post;
    return postReact;
  }
}
