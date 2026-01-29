import { UserRole } from '@constants/userRole.enum';
import { User } from '@entities/User';
import { appSwaggerTag } from '@modules/swagger-app/swagger-app.constant';
import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Auth } from 'src/decorators/auth.decorator';
import { FileValidationPipe } from 'src/decorators/file-validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags(appSwaggerTag.user)
@Auth(UserRole.User)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getMe() {
    return this.userService.getMe();
  }

  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover_avatar', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  async updateUserProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateUserDto,
    @UploadedFiles(
      new FileValidationPipe({
        maxSize: 1024 * 1024 * 11,
        fileType: /^image\/(jpg|jpeg|png|gif|webp)$/,
      }),
    )
    files: {
      avatar?: Express.Multer.File[];
      cover_avatar?: Express.Multer.File[];
    },
  ) {
    const user = req.user as User;
    const avatar = files?.avatar?.[0];
    const cover_avatar = files?.cover_avatar?.[0];

    const dto = { ...updateProfileDto, avatar, cover_avatar };

    return this.userService.updateUserProfile(user.id, dto);
  }
}
