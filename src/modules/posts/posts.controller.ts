import { UserRole } from '@constants/userRole.enum';
import { JwtAuthGuard } from '@modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guard/role.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiAuthUser } from 'src/decorators/api-auth-user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { SearchPostDto } from './dto/search-post.dto';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.User)
@ApiAuthUser()
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
