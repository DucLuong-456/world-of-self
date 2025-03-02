import { UserService } from '@modules/user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '@entities/User';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(loginDto.email);

    const isCorrectPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (isCorrectPassword) {
      const result = omit(user, ['password']);
      return result;
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

    return {
      access_token: await this.jwtService.signAsync(user, jwtOptions),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.findByEmail(registerDto.email);
    if (user) {
      throw new HttpException('Email đã tồn tại!', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashPassword,
    });
    await this.em.persistAndFlush(newUser);

    return newUser;
  }
}
