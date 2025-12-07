import { UserRole } from '@constants/userRole.enum';
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';

export function ApiAuthUser() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiCookieAuth(UserRole.User),
  );
}
