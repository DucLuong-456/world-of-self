import { User } from '@entities/User';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getBlacklistTokenKey } from 'src/utils/auth.utils';
import { extractTokenFromCookie } from '../guard/jwt-auth.guard';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractTokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const isBlacklisted = await this.cacheManager.get(
      getBlacklistTokenKey(payload.jti),
    );
    if (isBlacklisted) {
      throw new UnauthorizedException('Token revoked!');
    }

    const user = await this.userRepository.findOneOrFail(
      { id: payload.id },
      {
        fields: ['id', 'email', 'user_name', 'phone', 'role'],
        failHandler: () => {
          throw new UnauthorizedException('User not found!');
        },
      },
    );

    return user;
  }
}
