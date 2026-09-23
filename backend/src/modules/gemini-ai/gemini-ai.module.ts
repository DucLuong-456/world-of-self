import { Module } from '@nestjs/common';
import { GeminiAiService } from './gemini-ai.service';

@Module({
  providers: [GeminiAiService],
  exports: [GeminiAiService],
})
export class GeminiAiModule {}
