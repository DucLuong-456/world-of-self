import { PaginationDto } from '@dtos/pagination.dto';
import { User } from '@entities/src/entities/User';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserActivity } from '@entities/src/entities/UserActivity';
import { getTodayFormatted } from 'src/utils/date';
import { CheckInDto } from './dto/user-check-in.dto';
import { ActivityType } from '@constants/activityType.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserActivity)
    private readonly userActivityRepository: EntityRepository<UserActivity>,
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

  async checkIn(data: CheckInDto) {
    const user = await this.userRepository.findOneOrFail({ id: data.userId });
    const today = getTodayFormatted();
    const userCheckIn = await this.userActivityRepository.upsert(
      {
        user_id: user.id,
        activity_id: ActivityType.CheckIn,
        date: today,
      },
      {
        onConflictFields: ['user_id', 'date'],
        onConflictAction: 'merge',
      },
    );

    return userCheckIn;
  }
}
