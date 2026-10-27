import { Module } from '@nestjs/common';
import { AdminStickersModule } from './stickers/admin-stickers.module';

@Module({
  imports: [AdminStickersModule],
  exports: [AdminStickersModule],
})
export class AdminModule {}
