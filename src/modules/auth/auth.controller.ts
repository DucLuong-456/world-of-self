import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@constants/userRole.enum';
import { ApiAuthUser } from 'src/decorators/api-auth-user.decorator';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { Express } from 'express';
import { OptionalParseFilePipe } from 'src/decorators/OptionalParseFilePipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile(
      new OptionalParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    return this.authService.register({ ...registerDto, avatar });
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @ApiAuthUser()
  async logout(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];

    await this.authService.logout(token);
    return {
      message: 'logout successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
