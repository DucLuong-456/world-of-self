import { UserRole } from '@constants/userRole.enum';
import { appSwaggerTag } from '@modules/swagger-app/swagger-app.constant';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
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
}
