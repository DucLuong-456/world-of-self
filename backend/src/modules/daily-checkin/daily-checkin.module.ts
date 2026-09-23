import { DailyCheckIn } from '@entities/DailyCheckIn';
import { GemTransaction } from '@entities/GemTransaction';
import { GemWallet } from '@entities/GemWallet';
import { User } from '@entities/User';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DailyCheckInController } from './daily-checkin.controller';
import { DailyCheckInService } from './daily-checkin.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([DailyCheckIn, GemWallet, GemTransaction, User]),
  ],
  controllers: [DailyCheckInController],
  providers: [DailyCheckInService],
  exports: [DailyCheckInService],
})
export class DailyCheckInModule {}
