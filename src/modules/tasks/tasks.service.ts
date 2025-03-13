import { ActivityType } from '@constants/activityType.enum';
import { DailyScore } from '@entities/DailyScore';
import { UserActivity } from '@entities/UserActivity';
import { EntityManager } from '@mikro-orm/postgresql';
import { CalculationScoreDto } from '@modules/user/dto/calculation-score.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getTodayFormatted } from 'src/utils/date';

@Injectable()
export class TasksService {
  constructor(private em: EntityManager) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async calculateDailyCheckInScore(calculationScoreDto: CalculationScoreDto) {
    if (
      !Object.values(ActivityType).includes(calculationScoreDto.activity_type)
    ) {
      throw new HttpException(
        'Type activity không đúng',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.em.begin();
    try {
      const today = getTodayFormatted();
      let total_score = 0;
      const userCheckIn = await this.em.findOneOrFail(UserActivity, {
        user_id: calculationScoreDto.user_id,
        activity_id: ActivityType.CheckIn,
        date: today,
      });

      if (today === userCheckIn.date) {
        total_score = total_score + 10;
      }

      if (calculationScoreDto.activity_type === ActivityType.CheckIn) {
      }

      const dailyScore = await this.em.findOneOrFail(DailyScore, {
        user_id: calculationScoreDto.user_id,
        date: today,
      });

      await this.em.upsert(
        DailyScore,
        {
          user_id: calculationScoreDto.user_id,
          date: today,
          total_points: dailyScore.total_points + (userCheckIn ? 10 : 0),
        },
        {
          onConflictFields: ['user_id', 'date'],
          onConflictAction: 'merge',
        },
      );
      await this.em.commit();
    } catch (error) {
      await this.em.rollback();
      throw new HttpException(
        'calculation error transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
