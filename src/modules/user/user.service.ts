import { PaginationDto } from '@dtos/pagination.dto';
import { User } from '@entities/User';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private em: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (user) {
      throw new NotFoundException('user already exists');
    }

    const newUser = this.userRepository.create(createUserDto);
    await this.em.persistAndFlush(newUser);

    return newUser;
  }

  async findAll(data: PaginationDto) {
    const limit = data?.limit || 5;
    const page = data?.page || 1;
    const [users, totalCount] = await this.userRepository.findAndCount(
      {},
      {
        limit: limit,
        offset: (page - 1) * limit,
      },
    );

    return {
      users,
      paging: {
        limit: limit,
        page: page,
        totalCount,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('user already exists');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    wrap(user).assign(updateUserDto);
    await this.em.persistAndFlush(user);
    return 'update user successfully';
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.em.removeAndFlush(user);
    return 'delete user successfully';
  }
}
