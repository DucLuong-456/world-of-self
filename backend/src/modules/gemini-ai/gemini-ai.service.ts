import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiAiService {
  private readonly logger = new Logger(GeminiAiService.name);
  private readonly ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
  }

  async summarizeAndTag(
    content: string,
  ): Promise<{ summary: string; tags: string[] }> {
    try {
      const prompt = `
        Bạn là một AI phân tích nội dung. Hãy đọc bài viết sau và trả về thông tin theo định dạng JSON.
        - summary: Tóm tắt bài viết trong 1-2 câu.
        - tags: Một mảng chứa 3-5 từ khóa chính xác nhất về nội dung.

        Bài viết:
        """
        ${content}
        """

        TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON, KHÔNG THÊM BẤT KỲ VĂN BẢN NÀO KHÁC.
        VD: {"summary": "Đây là tóm tắt...", "tags": ["tag1", "tag2"]}
        `;
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from AI');
      }
      return JSON.parse(text);
    } catch (error) {
      this.logger.error('Failed to summarize content via Gemini', error);
      throw error;
    }
  }
}
