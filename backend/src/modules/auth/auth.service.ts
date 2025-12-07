import { User } from '@entities/User';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { UserService } from '@modules/user/user.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(loginDto.email);

    const isCorrectPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (isCorrectPassword) {
      return user;
    } else {
      throw new HttpException(
        'Thông tin đăng nhập không chính xác!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const jwtOptions = {
      expiresIn: process.env.EXPIRE_TIME,
      secret: process.env.SECRET_KEY,
    };

    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload, jwtOptions),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.findByEmail(registerDto.email);
    if (user) {
      throw new HttpException('email already exists!', HttpStatus.BAD_REQUEST);
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
    const decoded = this.jwtService.decode(token) as { exp: number };
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
      await this.cacheManager.set(`blacklist:${token}`, 'true', ttl);
    }
  }
}
