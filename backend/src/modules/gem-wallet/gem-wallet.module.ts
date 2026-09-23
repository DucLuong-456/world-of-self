import { GemTransaction } from '@entities/GemTransaction';
import { GemWallet } from '@entities/GemWallet';
import { InviteCode } from '@entities/InviteCode';
import { InviteCodeUsage } from '@entities/InviteCodeUsage';
import { User } from '@entities/User';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GemWalletController } from './gem-wallet.controller';
import { GemWalletService } from './gem-wallet.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      GemWallet,
      GemTransaction,
      InviteCode,
      InviteCodeUsage,
      User,
    ]),
  ],
  controllers: [GemWalletController],
  providers: [GemWalletService],
  exports: [GemWalletService],
})
export class GemWalletModule {}
