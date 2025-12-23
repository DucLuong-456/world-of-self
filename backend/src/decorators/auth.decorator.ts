import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserRole } from '@constants/userRole.enum';
import { Roles } from './role.decorator';
import { JwtAuthGuard } from '@modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guard/role.guard';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ApiAuthUser } from './api-auth-user.decorator';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    UseInterceptors(TransformInterceptor),
    ApiAuthUser(),
  );
}
