import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Comment } from '@entities/Comment';
import { MinioModule } from '@modules/minio/minio.module';

@Module({
  imports: [MikroOrmModule.forFeature([Comment]), MinioModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
