import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { StickerPack } from '@entities/StickerPack';
import { Sticker } from '@entities/Sticker';
import { MinioModule } from '../minio/minio.module';
import { StickerService } from './sticker.service';
import { StickerController } from './sticker.controller';

@Module({
  imports: [MikroOrmModule.forFeature([StickerPack, Sticker]), MinioModule],
  controllers: [StickerController],
  providers: [StickerService],
  exports: [StickerService],
})
export class StickerModule {}
