import { User } from '@entities/User';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
