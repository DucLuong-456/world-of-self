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
import { v4 as uuidv4 } from 'uuid';
import { BUCKET_NAME } from '@modules/minio/minio.config';
import { MinioService } from '@modules/minio/minio.service';
import { PaginatedPosts } from '@dtos/pagination.dto';

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
    private readonly minioService: MinioService,
  ) {}

  async getPosts(data: SearchPostDto): Promise<PaginatedPosts> {
    const limit = data?.limit || 5;
    const page = data?.page || 1;

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
        orderBy: { created_at: 'DESC' },
        populate: ['user.user_name', 'user.avatar', 'image'],
      },
    );

    const postsWithUrls = await Promise.all(
      posts.map(async (post) => {
        if (post.image?.path) {
          post.image.path = await this.minioService.getFileUrl(
            BUCKET_NAME,
            post.image.path,
          );
        }
        if (post.user?.avatar) {
          post.user.avatar = await this.minioService.getFileUrl(
            BUCKET_NAME,
            post.user.avatar,
          );
        }
        return post;
      }),
    );

    return {
      posts: postsWithUrls,
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

    let post: Post;
    await this.em.begin();
    try {
      let storedImage: StoredImage;

      if (data.thumbnail) {
        const extension = data.thumbnail.originalname.split('.').pop();
        const fileName = `posts/${uuidv4()}.${extension}`;
        await this.minioService.uploadFile(
          BUCKET_NAME,
          fileName,
          data.thumbnail.buffer,
          data.thumbnail.mimetype,
        );

        storedImage = this.em.create(StoredImage, {
          path: fileName,
          ext: extension,
        });
        await this.em.persistAndFlush(storedImage);
      }

      post = this.postRepository.create({
        ...(data?.title && { title: data.title }),
        content: data.content,
        ...(data?.category && { category: data.category }),
        user_id: userId,
        stored_image_id: storedImage.id,
      });

      await this.em.persistAndFlush(post);
      await this.em.commit();
    } catch (error) {
      await this.em.rollback();
      throw error;
    }

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
        fields: ['user_id', 'post_id', 'created_at', 'updated_at'],
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
      throw new NotFoundException('Post react roll back', error);
    }
    //{ persist: false }: Đảm bảo user và post không tự động lưu hoặc populate trừ khi bạn yêu cầu.
    //@ManyToOne(() => Post, { persist: false })
    // post!: Post;
    return postReact;
  }
}
