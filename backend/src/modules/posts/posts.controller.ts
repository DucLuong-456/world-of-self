import { UserRole } from '@constants/userRole.enum';
import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { PostsService } from './posts.service';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BaseResponse, PagingResponse } from 'src/interceptors/transform.interceptor';

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

@Auth(UserRole.User)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query() data: SearchPostDto) {
    const { posts, paging } = await this.postsService.getPosts(data);
    return new PagingResponse(posts, paging);
  }

  @Get('/templates')
  async getTemplates() {
    const templates = await this.postsService.getTemplates();
    return new BaseResponse(templates);
  }

  @Get('/:id')
  getPost(@Param('id') postId: string) {
    return this.postsService.getPost(postId);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', MAX_IMAGES))
  create(
    @Body() data: CreatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    if (images && images.length > MAX_IMAGES) {
      throw new BadRequestException(
        `Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh mỗi bài đăng.`,
      );
    }

    // Validate file types and sizes manually since ParseFilePipe doesn't support array well
    if (images?.length) {
      for (const file of images) {
        if (file.size > MAX_FILE_SIZE) {
          throw new BadRequestException(
            `File ${file.originalname} vượt quá dung lượng cho phép (5MB).`,
          );
        }
        if (!file.mimetype.startsWith('image/')) {
          throw new BadRequestException(
            `File ${file.originalname} không phải là ảnh hợp lệ.`,
          );
        }
      }
    }

    return this.postsService.create({ ...data, images });
  }

  @Patch('/:id/react')
  toggleReact(@Param('id') postId: string) {
    return this.postsService.toggleReact(postId);
  }
}
