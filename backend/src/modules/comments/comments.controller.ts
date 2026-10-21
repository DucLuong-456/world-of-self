import { Controller, Get, Post, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from '@constants/userRole.enum';
import { BaseResponse, PagingResponse } from 'src/interceptors/transform.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Auth(UserRole.User)
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('posts/:postId/comments')
  async create(@Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    const comment = await this.commentsService.create(postId, dto);
    return new BaseResponse(comment);
  }

  @Get('posts/:postId/comments')
  async getRootComments(
    @Param('postId') postId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const { comments, paging } = await this.commentsService.getRootComments(
      postId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
    return new PagingResponse(comments, paging);
  }

  @Get('comments/:id/replies')
  async getReplies(
    @Param('id') commentId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const { replies, paging } = await this.commentsService.getReplies(
      commentId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
    return new PagingResponse(replies, paging);
  }

  @Patch('comments/:id')
  async update(@Param('id') commentId: string, @Body() dto: UpdateCommentDto) {
    const comment = await this.commentsService.update(commentId, dto);
    return new BaseResponse(comment);
  }

  @Delete('comments/:id')
  async remove(@Param('id') commentId: string) {
    await this.commentsService.remove(commentId);
    return new BaseResponse({ success: true });
  }
}
