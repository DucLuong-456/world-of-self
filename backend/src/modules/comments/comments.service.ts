import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';
import { Comment } from '@entities/Comment';
import { User } from '@entities/User';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { MinioService } from '@modules/minio/minio.service';
import { BUCKET_NAME } from '@modules/minio/minio.config';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
    @Inject(REQUEST) protected request: Request,
    private readonly minioService: MinioService,
  ) {}

  async create(postId: string, dto: CreateCommentDto) {
    const userId = (this.request.user as User)?.id;
    
    // Create new comment entity
    const comment = this.commentRepository.create({
      content: dto.content,
      post_id: postId,
      post: postId,
      parent_id: dto.parent_id || null,
      parent: dto.parent_id || null,
      created_by: userId,
      user: userId,
    });
    
    await this.commentRepository.getEntityManager().persistAndFlush(comment);
    
    // Load nested relations to return complete comment object
    await this.commentRepository.getEntityManager().populate(comment, ['user.user_name', 'user.avatar']);
    
    if (comment.user?.avatar) {
      comment.user.avatar = await this.minioService.getFileUrl(BUCKET_NAME, comment.user.avatar);
    }
    return comment;
  }

  async getRootComments(postId: string, page: number = 1, limit: number = 20) {
    const [comments, totalCount] = await this.commentRepository.findAndCount(
      { post_id: postId, parent_id: null, deletedAt: null },
      {
        limit: limit,
        offset: (page - 1) * limit,
        orderBy: { created_at: 'DESC' }, // Show newest root comments first
        populate: ['user.user_name', 'user.avatar'],
      },
    );

    // Get replies count for each root comment
    const mappedComments = [];
    for (const comment of comments) {
       const count = await this.commentRepository.count({ parent_id: comment.id, deletedAt: null });
       const commentJson = wrap(comment).toJSON();
       (commentJson as any).repliesCount = count;
       
       if (commentJson.user?.avatar) {
         commentJson.user.avatar = await this.minioService.getFileUrl(BUCKET_NAME, commentJson.user.avatar);
       }
       
       mappedComments.push(commentJson);
    }

    return {
      comments: mappedComments,
      paging: { limit, page, totalCount },
    };
  }

  async getReplies(commentId: string, page: number = 1, limit: number = 20) {
    const [replies, totalCount] = await this.commentRepository.findAndCount(
      { parent_id: commentId, deletedAt: null },
      {
        limit: limit,
        offset: (page - 1) * limit,
        orderBy: { created_at: 'ASC' }, // Show oldest replies first (chronological)
        populate: ['user.user_name', 'user.avatar'],
      },
    );

    const mappedReplies = [];
    for (const reply of replies) {
       const count = await this.commentRepository.count({ parent_id: reply.id, deletedAt: null });
       const replyJson = wrap(reply).toJSON();
       (replyJson as any).repliesCount = count;
       
       if (replyJson.user?.avatar) {
         replyJson.user.avatar = await this.minioService.getFileUrl(BUCKET_NAME, replyJson.user.avatar);
       }
       
       mappedReplies.push(replyJson);
    }

    return {
      replies: mappedReplies,
      paging: { limit, page, totalCount },
    };
  }

  async update(commentId: string, dto: UpdateCommentDto) {
    const userId = (this.request.user as User)?.id;
    
    const comment = await this.commentRepository.findOne({ id: commentId, created_by: userId, deletedAt: null });
    if (!comment) {
      throw new NotFoundException('Comment not found or access denied');
    }

    comment.content = dto.content;
    await this.commentRepository.getEntityManager().persistAndFlush(comment);
    
    await this.commentRepository.getEntityManager().populate(comment, ['user.user_name', 'user.avatar']);
    return comment;
  }

  async remove(commentId: string) {
    const userId = (this.request.user as User)?.id;
    
    const comment = await this.commentRepository.findOne({ id: commentId, created_by: userId, deletedAt: null });
    if (!comment) {
      throw new NotFoundException('Comment not found or access denied');
    }

    // Soft delete manually by setting deleted_at
    comment.deletedAt = new Date();
    await this.commentRepository.getEntityManager().persistAndFlush(comment);
    
    return { success: true };
  }
}
