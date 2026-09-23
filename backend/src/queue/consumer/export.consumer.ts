import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueName } from '../queueName.enum';
import { JobName } from '../jobName.enum';
import { ExportJobPayload } from '../queue.payload';

@Processor(QueueName.ExportQueue)
export class ExportConsumer {
  @Process(JobName.ExportJob)
  async handleExportJob(job: Job<ExportJobPayload>) {
    console.log('Processing job:', job.data);

    const { userId, filePath } = job.data;
    console.log(`Exporting data for user ${userId} to ${filePath}`);

    return `Exported data for user ${userId}`;
  }
}
