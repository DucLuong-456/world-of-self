import { CookieOptions } from 'express';
import * as jwt from 'jsonwebtoken';

export const getCookieOptions = (token?: string): CookieOptions => {
  const decodeToken = token ? (jwt.decode(token) as jwt.JwtPayload) : undefined;

  return process.env.COOKIE_DOMAIN
    ? {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        domain: process.env.COOKIE_DOMAIN,
        maxAge: decodeToken
          ? ((decodeToken?.exp ?? 0) - (decodeToken?.iat ?? 0)) * 1000
          : undefined,
      }
    : {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: decodeToken
          ? ((decodeToken?.exp ?? 0) - (decodeToken?.iat ?? 0)) * 1000
          : undefined,
      };
};
