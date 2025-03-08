import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './mikro-orm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UsersModule } from './modules/users/users.module';
import { QueueName } from './queue/queueName.enum';
import { PostsModule } from './modules/posts/posts.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    UserModule,
    MikroOrmModule.forRoot(config),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
    }),
    AuthModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: QueueName.ExportQueue,
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
