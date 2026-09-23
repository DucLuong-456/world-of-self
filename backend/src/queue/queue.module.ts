import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueName } from './queueName.enum';
import { QueueService } from './queue.service';
import { QueueProcessor } from './consumer/queue.processor';

import { MinioModule } from '@modules/minio/minio.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Post } from '@entities/Post';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post]),
    MinioModule,
    BullModule.registerQueue({
      name: QueueName.ExportQueue,
    }),
  ],
  controllers: [],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService],
})
export class QueueModule {}
