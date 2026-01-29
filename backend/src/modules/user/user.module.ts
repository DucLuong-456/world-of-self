import { User } from '@entities/User';
import { UserProfile } from '@entities/UserProfile';
import { UserRelationship } from '@entities/UserRelationship';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MinioModule } from '@modules/minio/minio.module';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, UserRelationship, UserProfile]),
    MinioModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
