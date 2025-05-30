import { UserRole } from '@constants/userRole.enum';
import { JwtAuthGuard } from '@modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guard/role.guard';
import { appSwaggerTag } from '@modules/swagger-app/swagger-app.constant';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { UserService } from './user.service';

@ApiTags(appSwaggerTag.user)
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.User)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
