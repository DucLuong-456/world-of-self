import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { StickerPack } from '@entities/StickerPack';
import { Sticker } from '@entities/Sticker';
import { MinioModule } from '../../minio/minio.module';
import { AdminStickersController } from './admin-stickers.controller';
import { AdminStickersService } from './admin-stickers.service';

@Module({
  imports: [MikroOrmModule.forFeature([StickerPack, Sticker]), MinioModule],
  controllers: [AdminStickersController],
  providers: [AdminStickersService],
  exports: [AdminStickersService],
})
export class AdminStickersModule {}
