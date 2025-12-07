import { User } from '@entities/User';
import { UserRelationship } from '@entities/UserRelationship';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature([User, UserRelationship])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
