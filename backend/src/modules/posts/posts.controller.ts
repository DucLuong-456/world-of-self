import { UserRole } from '@constants/userRole.enum';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { PostsService } from './posts.service';

@Auth(UserRole.User)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(@Query() data: SearchPostDto) {
    return this.postsService.getPosts(data);
  }

  @Get('/:id')
  getPost(@Param('id') postId: string) {
    return this.postsService.getPost(postId);
  }

  @Post()
  create(@Body() data: CreatePostDto) {
    return this.postsService.create(data);
  }

  @Patch('/:id/react')
  toggleReact(@Param('id') postId: string) {
    return this.postsService.toggleReact(postId);
  }
}
