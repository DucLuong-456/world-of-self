import { ActivityType } from '@constants/activityType.enum';
import { Activity } from '@entities/Activity';
import { DailyScore } from '@entities/DailyScore';
import { User } from '@entities/User';
import { UserActivity } from '@entities/UserActivity';
import { UserRelationship } from '@entities/UserRelationship';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { getTodayFormatted } from 'src/utils/date';
import { CheckInDto } from './dto/user-check-in.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserActivity)
    private readonly userActivityRepository: EntityRepository<UserActivity>,
    @InjectRepository(Activity)
    private readonly activityRepository: EntityRepository<Activity>,
    @InjectRepository(UserRelationship)
    private readonly userRelationshipRepository: EntityRepository<UserRelationship>,
    @InjectRepository(DailyScore)
    private readonly dailyScoreRepository: EntityRepository<DailyScore>,
    private em: EntityManager,
  ) {}

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    return user;
  }

  async checkIn(data: CheckInDto) {
    const user = await this.userRepository.findOneOrFail(
      { id: data.userId },
      { populate: ['user_activities'] },
    );
    const checkInActivity = await this.activityRepository.findOneOrFail({
      type: ActivityType.CheckIn,
    });
    const today = getTodayFormatted();

    let userCheckIn = await this.userActivityRepository.findOne({
      user_id: user.id,
      activity_id: checkInActivity.id,
      date: today,
    });

    let dailyScore = await this.dailyScoreRepository.findOne({
      user_id: user.id,
      date: today,
    });

    if (!userCheckIn) {
      userCheckIn = this.userActivityRepository.create({
        user_id: user.id,
        activity_id: checkInActivity.id,
        date: today,
      });
      await this.em.persistAndFlush(userCheckIn);
      if (!dailyScore) {
        dailyScore = this.dailyScoreRepository.create({
          user_id: user.id,
          date: today,
          total_points: 10,
        });
        await this.em.persistAndFlush(dailyScore);
      }
    }

    return;
  }
}
