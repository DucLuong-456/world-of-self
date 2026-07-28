import { Post } from '@entities/Post';
import { PostReact } from '@entities/PostReact';
import { PostImage } from '@entities/PostImage';
import { PostTemplate } from '@entities/PostTemplate';
import { User } from '@entities/User';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { v4 as uuidv4 } from 'uuid';
import { BUCKET_NAME } from '@modules/minio/minio.config';
import { MinioService } from '@modules/minio/minio.service';
import { PaginatedPosts } from '@dtos/pagination.dto';

const MAX_IMAGES = 10;
const MAX_TEMPLATE_CONTENT_LENGTH = 150;

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Post)
    private readonly postRepository: EntityRepository<Post>,
    @InjectRepository(PostReact)
    private readonly postReactRepository: EntityRepository<PostReact>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: EntityRepository<PostImage>,
    @InjectRepository(PostTemplate)
    private readonly postTemplateRepository: EntityRepository<PostTemplate>,
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
        populate: ['user.user_name', 'user.avatar', 'images', 'template'],
      },
    );

    const userId = (this.request.user as User)?.id;
    let reactedPostIds = new Set<string>();
    if (userId) {
      const reactions = await this.postReactRepository.find({
        user_id: userId,
        post_id: { $in: posts.map((p) => p.id) },
      });
      reactedPostIds = new Set(reactions.map((r) => r.post_id));
    }

    const postsWithUrls = await Promise.all(
      posts.map(async (post) => {
        post.is_reacted = reactedPostIds.has(post.id);

        // Resolve presigned URLs for all images
        if (post.images?.isInitialized()) {
          await Promise.all(
            post.images.getItems().map(async (img) => {
              img.path = await this.minioService.getFileUrl(
                BUCKET_NAME,
                img.path,
              );
            }),
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
    const userId = (this.request.user as User)?.id;
    const post = await this.postRepository.findOne(
      { id: postId },
      { populate: ['user', 'images', 'template'] },
    );

    if (post && userId) {
      const reaction = await this.postReactRepository.findOne({
        user_id: userId,
        post_id: postId,
      });
      post.is_reacted = !!reaction;
    }

    if (post?.images?.isInitialized()) {
      await Promise.all(
        post.images.getItems().map(async (img) => {
          img.path = await this.minioService.getFileUrl(BUCKET_NAME, img.path);
        }),
      );
    }

    if (post?.user?.avatar) {
      post.user.avatar = await this.minioService.getFileUrl(
        BUCKET_NAME,
        post.user.avatar,
      );
    }

    return post;
  }

  async create(data: CreatePostDto) {
    const userId = (this.request.user as User)?.id;

    // Validate image count
    if (data.images && data.images.length > MAX_IMAGES) {
      throw new BadRequestException(
        `Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh mỗi bài đăng.`,
      );
    }

    // For text-only posts: only allow template if content is short enough
    const isTextOnly = !data.images || data.images.length === 0;
    const applyTemplate =
      isTextOnly &&
      data.template_id &&
      data.content.length <= MAX_TEMPLATE_CONTENT_LENGTH;

    let post: Post;
    await this.em.begin();
    try {
      post = this.postRepository.create({
        ...(data?.title && { title: data.title }),
        content: data.content,
        ...(data?.category && { category: data.category }),
        user_id: userId,
        ...(applyTemplate && { template_id: data.template_id }),
      });
      await this.em.persistAndFlush(post);

      // Upload images in parallel and create PostImage records
      if (data.images && data.images.length > 0) {
        const imageEntities = await Promise.all(
          data.images.map(async (file, index) => {
            const extension = file.originalname.split('.').pop();
            const fileName = `posts/${uuidv4()}.${extension}`;
            await this.minioService.uploadFile(
              BUCKET_NAME,
              fileName,
              file.buffer,
              file.mimetype,
            );
            return this.em.create(PostImage, {
              path: fileName,
              ext: extension,
              post: post, // Pass the parent entity reference
              sort_order: index,
            });
          }),
        );
        await this.em.persistAndFlush(imageEntities);
      }

      await this.em.commit();
    } catch (error) {
      await this.em.rollback();
      throw error;
    }

    return post;
  }

  async getTemplates() {
    return this.postTemplateRepository.findAll();
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

    return postReact;
  }
}
