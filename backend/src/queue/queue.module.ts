import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueName } from './queueName.enum';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.ExportQueue,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class QueueModule {}
