import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { MinioService } from './minio.service';
import { S3_CLIENT } from './minio.config';

@Module({
  providers: [
    {
      provide: S3_CLIENT,
      useFactory: () => {
        return new S3Client({
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
          },
          forcePathStyle: true,
        });
      },
    },
    MinioService,
  ],
  exports: [S3_CLIENT, MinioService],
})
export class MinioModule {}
