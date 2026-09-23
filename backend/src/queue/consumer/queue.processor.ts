import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Post } from '@entities/Post';
import { MinioService } from '@modules/minio/minio.service';
import { BUCKET_NAME } from '@modules/minio/minio.config';

@Processor('export-queue')
export class QueueProcessor {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: EntityRepository<Post>,
    private readonly minioService: MinioService,
  ) {}

  @Process('export-job')
  async handleExportJob(job: Job) {
    const { userId } = job.data;
    console.log(
      `[Export Job] Bắt đầu xử lý export dữ liệu cho user: ${userId}`,
    );

    // Fetch posts. This automatically uses the read replica due to `preferReadReplicas: true`!
    const posts = await this.postRepository.find(
      { user_id: userId },
      { orderBy: { created_at: 'DESC' } },
    );

    // Generate CSV string
    const headers = [
      'ID',
      'Title',
      'Content',
      'Category',
      'React Count',
      'Created At',
    ];
    const rows = posts.map((post) => [
      post.id,
      `"${(post.title || '').replace(/"/g, '""')}"`, // escape quotes
      `"${(post.content || '').replace(/"/g, '""')}"`,
      post.category || '',
      post.react_count,
      post.created_at.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Upload to Minio
    const fileName = `exports/user_${userId}_posts_${Date.now()}.csv`;
    const buffer = Buffer.from(csvContent, 'utf-8');

    await this.minioService.uploadFile(
      BUCKET_NAME,
      fileName,
      buffer,
      'text/csv',
    );

    const downloadUrl = await this.minioService.getFileUrl(
      BUCKET_NAME,
      fileName,
    );
    console.log(`[Export Job] Hoàn tất! File đã được upload: ${downloadUrl}`);

    return { success: true, url: downloadUrl };
  }
}
