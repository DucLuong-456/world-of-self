import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueName } from '../queueName.enum';
import { JobName } from '../jobName.enum';
import { AiSummarizePayload } from '../queue.payload';
import { GeminiAiService } from '../../modules/gemini-ai/gemini-ai.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Post } from '../../entities/src/entities/Post';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';

@Processor(QueueName.AiQueue)
export class GeminiAiConsumer {
  private readonly logger = new Logger(GeminiAiConsumer.name);

  constructor(
    private readonly aiService: GeminiAiService,
    @InjectRepository(Post)
    private readonly postRepository: EntityRepository<Post>,
    private readonly em: EntityManager,
  ) {}

  @Process(JobName.AiSummarizePost)
  async handleSummarizeJob(job: Job<AiSummarizePayload>) {
    this.logger.log(`Processing AI summarize job for post: ${job.data.postId}`);
    const { postId } = job.data;

    try {
      // Create a fresh fork of EntityManager for this background job to avoid context issues
      const em = this.em.fork();
      const postRepository = em.getRepository(Post);

      const post = await postRepository.findOne({ id: postId });
      if (!post || !post.content) {
        this.logger.warn(`Post ${postId} not found or has no content`);
        return;
      }

      const result = await this.aiService.summarizeAndTag(post.content);

      post.summary = result.summary;
      post.tags = result.tags;

      await em.persistAndFlush(post);
      this.logger.log(`Successfully summarized post: ${postId}`);
    } catch (error) {
      this.logger.error(`Failed to summarize post: ${postId}`, error);
      throw error; // Bull will retry based on config
    }
  }
}
