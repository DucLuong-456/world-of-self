import { GemTransaction } from '@entities/GemTransaction';
import { GemWallet } from '@entities/GemWallet';
import { Item } from '@entities/Item';
import { User } from '@entities/User';
import { UserItem } from '@entities/UserItem';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Item,
      GemWallet,
      GemTransaction,
      UserItem,
      User,
    ]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
