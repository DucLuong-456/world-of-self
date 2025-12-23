import { CookieKey } from '@constants/auth.enum';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { parse } from 'cookie';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export const extractTokenFromCookie = (
  request: Request,
  options: { type: CookieKey } = { type: CookieKey.ACCESS_TOKEN },
): string | undefined => {
  const cookie = parse(request.headers.cookie ?? '');

  return (
    (request &&
      (cookie[options.type] ||
        request.headers?.authorization?.split(' ')[1])) ??
    ''
  );
};
