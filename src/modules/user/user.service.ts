import { ActivityType } from '@constants/activityType.enum';
import { User } from '@entities/User';
import { UserActivity } from '@entities/UserActivity';
import { UserRelationship } from '@entities/UserRelationship';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { getTodayFormatted } from 'src/utils/date';
import { CheckInDto } from './dto/user-check-in.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserActivity)
    private readonly userActivityRepository: EntityRepository<UserActivity>,
    @InjectRepository(UserRelationship)
    private readonly userRelationshipRepository: EntityRepository<UserRelationship>,
    private em: EntityManager,
  ) {}

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
