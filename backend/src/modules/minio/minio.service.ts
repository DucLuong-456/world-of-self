import { Injectable, Inject } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CLIENT } from './minio.config';

@Injectable()
export class MinioService {
  constructor(@Inject(S3_CLIENT) private readonly s3Client: S3Client) {}

  private async setBucketPublic(bucketName: string) {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await this.s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(policy),
      }),
    );
  }

  async uploadFile(
    bucketName: string,
    fileName: string,
    buffer: Buffer,
    contentType?: string,
  ) {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch {
      await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      await this.setBucketPublic(bucketName);
    }

    return await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
      }),
    );
  }

  async deleteFile(bucketName: string, fileName: string) {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: fileName,
        }),
      );
    } catch (error) {
      console.error(
        `Failed to delete file ${fileName} from ${bucketName}`,
        error,
      );
    }
  }

  async getFileUrl(bucketName: string, fileName: string) {
    const publicEndpoint =
      process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT;
    const S3_PUBLIC_ACCESS_ENV_LOCAL = true;

    if (S3_PUBLIC_ACCESS_ENV_LOCAL) {
      return `${publicEndpoint}/${bucketName}/${fileName}`;
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 86400 });
  }
}
