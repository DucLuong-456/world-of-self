import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueName } from './queueName.enum';
import { JobName } from './jobName.enum';
import { ExportJobPayload, AiSummarizePayload } from './queue.payload';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueName.ExportQueue) private readonly exportQueue: Queue,
    @InjectQueue(QueueName.AiQueue) private readonly aiQueue: Queue,
  ) {}

  async addExportJob(data: ExportJobPayload) {
    await this.exportQueue.add(JobName.ExportJob, data, {
      attempts: 3,
      backoff: 5000,
    });
    return 'Job added to export queue!';
  }

  async addSummarizePostJob(postId: string) {
    const payload: AiSummarizePayload = { postId };
    await this.aiQueue.add(JobName.AiSummarizePost, payload, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
    });
    return 'Job added to ai queue!';
  }
}
