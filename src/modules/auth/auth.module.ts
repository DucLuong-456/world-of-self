import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { User } from '@entities/User';
import { MikroOrmModule } from '@mikro-orm/nestjs';
dotenv.config();

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRE_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy],
})
export class AuthModule {}
