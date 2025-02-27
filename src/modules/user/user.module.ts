import { User } from '@entities/User';
import { UserActivity } from '@entities/UserActivity';
import { UserRelationship } from '@entities/UserRelationship';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature([User, UserActivity, UserRelationship])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
