import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('export-queue')
export class QueueProcessor {
  @Process('export-job')
  async handleExportJob(job: Job) {
    console.log('Processing job:', job.data);

    const { userId, filePath } = job.data;
    console.log(`Exporting data for user ${userId} to ${filePath}`);

    return `Exported data for user ${userId}`;
  }
}
