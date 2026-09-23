import { GemTransaction } from '@entities/GemTransaction';
import { GemWallet } from '@entities/GemWallet';
import { SpinHistory } from '@entities/SpinHistory';
import { User } from '@entities/User';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SpinController } from './spin.controller';
import { SpinService } from './spin.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SpinHistory, GemWallet, GemTransaction, User]),
  ],
  controllers: [SpinController],
  providers: [SpinService],
  exports: [SpinService],
})
export class SpinModule {}
