import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { User } from '@entities/User';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserProfile } from '@entities/UserProfile';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, UserProfile]),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRE_TIME_ACCESS_TOKEN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
