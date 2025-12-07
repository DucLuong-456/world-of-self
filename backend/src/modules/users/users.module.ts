import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@entities/User';
import { UserRelationship } from '@entities/UserRelationship';

@Module({
  imports: [MikroOrmModule.forFeature([User, UserRelationship])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
