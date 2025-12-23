import { JwtPayloadType } from '@constants/Jwt-payload-type.enum';
import { User } from '@entities/User';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { UserService } from '@modules/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  ValidationError,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { getBlacklistTokenKey } from 'src/utils/auth.utils';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new HttpException('email not exists!', HttpStatus.BAD_REQUEST);
    }
    const isCorrectPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isCorrectPassword) {
      throw new HttpException('login not success!', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async generateTokens(userId: string) {
    const jti = uuidv4();

    const token = await this.jwtService.signAsync(
      {
        id: userId,
        type: JwtPayloadType.User,
        jti,
      },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.EXPIRE_TIME_ACCESS_TOKEN,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: userId,
        type: JwtPayloadType.User,
        at_jti: jti,
      },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.EXPIRE_TIME_REFRESH_TOKEN,
      },
    );

    return { accessToken: token, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.findByEmail(registerDto.email);
    if (user) {
      throw new HttpException('Email already exists!', HttpStatus.BAD_REQUEST);
    }

    const avatar = registerDto?.avatar?.originalname;
    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashPassword,
      avatar,
    });
    await this.em.persistAndFlush(newUser);

    return newUser;
  }

  async logout(token: string): Promise<void> {
    const decodeToken = this.jwtService.decode(token) as jwt.JwtPayload;
    const ttl = decodeToken.exp * 1000 - Date.now();

    if (ttl > 0) {
      await this.cacheManager.set(
        getBlacklistTokenKey(decodeToken.jti),
        1,
        ttl,
      );
    }
  }

  async refreshAccessToken({
    access_token: oldAccessToken,
    refresh_token: oldRefreshToken,
  }: RefreshTokenDto) {
    const errors: ValidationError[] = [];
    const decodedAccessToken = await this.jwtService
      .verifyAsync<jwt.JwtPayload | null>(oldAccessToken, {
        ignoreExpiration: true,
      })
      .catch((reason) => {
        errors.push({
          property: 'access_token',
          value: oldAccessToken,
          constraints: {
            isValid: reason.message,
          },
          children: [],
        });
        return null;
      });
    const decodedRefreshToken = await this.jwtService
      .verifyAsync<jwt.JwtPayload | null>(oldRefreshToken)
      .catch((reason) => {
        errors.push({
          property: 'refresh_token',
          value: oldRefreshToken,
          constraints: {
            isValid: reason.message,
          },
          children: [],
        });
        return null;
      });
    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    // Compare jti
    if (decodedAccessToken.jti !== decodedRefreshToken.at_jti) {
      throw new HttpException("Token's jti not match", HttpStatus.BAD_REQUEST);
    }

    // Check if token have been blocked
    const cachedTokenJti = await this.cacheManager.get(
      getBlacklistTokenKey(decodedRefreshToken.at_jti),
    );
    if (cachedTokenJti) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    // Block old tokens into cache
    await this.cacheManager.set(
      getBlacklistTokenKey(decodedRefreshToken.at_jti),
      1,
      decodedRefreshToken.exp * 1000 - Date.now(),
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(decodedRefreshToken.id);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: undefined,
    };
  }
}
