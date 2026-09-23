import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueName } from './queueName.enum';
import { GeminiAiConsumer } from './consumer/gemini-ai.consumer';
import { ExportConsumer } from './consumer/export.consumer';
import { QueueService } from './queue.service';
import { GeminiAiModule } from '../modules/gemini-ai/gemini-ai.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Post } from '../entities/src/entities/Post';

@Module({
  imports: [
    GeminiAiModule,
    MikroOrmModule.forFeature([Post]),
    BullModule.registerQueue({
      name: QueueName.ExportQueue,
    }),
    BullModule.registerQueue({
      name: QueueName.AiQueue,
    }),
  ],
  controllers: [],
  providers: [GeminiAiConsumer, ExportConsumer, QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {}
