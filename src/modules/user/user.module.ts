import { User } from '@entities/src/entities/User';
import { UserActivity } from '@entities/src/entities/UserActivity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature([User, UserActivity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
