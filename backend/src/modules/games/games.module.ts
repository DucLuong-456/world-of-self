import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GameSession } from '@entities/GameSession';
import { GemWallet } from '@entities/GemWallet';
import { GemTransaction } from '@entities/GemTransaction';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([GameSession, GemWallet, GemTransaction]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
