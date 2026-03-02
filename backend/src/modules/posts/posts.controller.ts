import { UserRole } from '@constants/userRole.enum';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { PostsService } from './posts.service';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalParseFilePipe } from 'src/decorators/OptionalParseFilePipe';
import { PagingResponse } from 'src/interceptors/transform.interceptor';

@Auth(UserRole.User)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query() data: SearchPostDto) {
    const { posts, paging } = await this.postsService.getPosts(data);
    return new PagingResponse(posts, paging);
  }

  @Get('/:id')
  getPost(@Param('id') postId: string) {
    return this.postsService.getPost(postId);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(
    @Body() data: CreatePostDto,
    @UploadedFile(
      new OptionalParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    thumbnail: Express.Multer.File,
  ) {
    return this.postsService.create({ ...data, thumbnail });
  }

  @Patch('/:id/react')
  toggleReact(@Param('id') postId: string) {
    return this.postsService.toggleReact(postId);
  }
}
