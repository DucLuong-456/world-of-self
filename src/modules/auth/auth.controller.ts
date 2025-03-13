import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@constants/userRole.enum';
import { ApiAuthUser } from 'src/decorators/api-auth-user.decorator';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
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
