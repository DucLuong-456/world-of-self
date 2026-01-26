import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { extractTokenFromCookie, JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@constants/userRole.enum';
import { ApiAuthUser } from 'src/decorators/api-auth-user.decorator';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { Express } from 'express';
import { OptionalParseFilePipe } from 'src/decorators/OptionalParseFilePipe';
import { getCookieOptions } from 'src/utils/get-cookie-options';
import { CookieKey } from '@constants/auth.enum';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie(
      CookieKey.ACCESS_TOKEN,
      result.accessToken,
      getCookieOptions(result.accessToken),
    );

    res.cookie(
      CookieKey.REFRESH_TOKEN,
      result.refreshToken,
      getCookieOptions(result.refreshToken),
    );
    return result;
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

  @Post('/refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = extractTokenFromCookie(req);
    const refreshToken = extractTokenFromCookie(req, {
      type: CookieKey.REFRESH_TOKEN,
    });

    if (!refreshToken || !accessToken) {
      throw new UnauthorizedException('Missing token');
    }

    const result = await this.authService.refreshAccessToken({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    res.cookie(
      CookieKey.ACCESS_TOKEN,
      result.access_token,
      getCookieOptions(result.access_token),
    );

    res.cookie(
      CookieKey.REFRESH_TOKEN,
      result.refresh_token,
      getCookieOptions(result.refresh_token),
    );

    return result;
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  @ApiAuthUser()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = extractTokenFromCookie(req);
    res.clearCookie(CookieKey.ACCESS_TOKEN);
    await this.authService.logout(token);

    return { oke: true };
  }

  @Post('/google')
  async googleAuth(
    @Body() body: GoogleAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.googleAuth(body);

    res.cookie(
      CookieKey.ACCESS_TOKEN,
      result.accessToken,
      getCookieOptions(result.accessToken),
    );

    res.cookie(
      CookieKey.REFRESH_TOKEN,
      result.refreshToken,
      getCookieOptions(result.refreshToken),
    );

    return result;
  }
}
