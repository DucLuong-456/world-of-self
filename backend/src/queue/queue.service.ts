import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueName } from './queueName.enum';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueName.ExportQueue) private readonly queue: Queue,
  ) {}

  async addJob(data: any) {
    await this.queue.add('export-job', data, {
      attempts: 3,
      backoff: 5000,
    });
    return 'Job added to queue!';
  }
}
