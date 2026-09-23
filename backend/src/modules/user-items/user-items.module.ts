import { UserItem } from '@entities/UserItem';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserItemsController } from './user-items.controller';
import { UserItemsService } from './user-items.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserItem])],
  controllers: [UserItemsController],
  providers: [UserItemsService],
  exports: [UserItemsService],
})
export class UserItemsModule {}
