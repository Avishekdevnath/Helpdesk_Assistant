import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { GenerateReplyResponse } from '@helpdesk/shared-types';
import { KbService } from '../kb/kb.service';
import { QuestionsService } from '../questions/questions.service';
import { GenerateReplyDto } from './dto/generate-reply.dto';
import { buildPrompt, decideMode } from './prompts';

@Injectable()
export class AiService {
  private readonly client: OpenAI;

  constructor(
    private readonly kb: KbService,
    private readonly questions: QuestionsService,
    config: ConfigService,
  ) {
    const apiKey = config.get<string>('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY missing');
    this.client = new OpenAI({ apiKey });
  }

  async generateReply(dto: GenerateReplyDto): Promise<GenerateReplyResponse> {
    const query = `${dto.postTitle}\n${dto.postBody}`;
    const [kbHits, questionHits] = await Promise.all([
      this.kb.search(query, 5),
      this.questions.search(query, 3),
    ]);
    const mode = decideMode(questionHits);
    const prompt = buildPrompt(mode, { title: dto.postTitle, body: dto.postBody }, kbHits, questionHits);

    const response = await this.client.responses.create({
      model: 'gpt-5.4-mini',
      max_output_tokens: 1024,
      input: prompt,
    });
    if (!response.output_text) {
      throw new InternalServerErrorException('OpenAI returned no text');
    }

    return {
      mode,
      reply: response.output_text,
      kbHits: kbHits.map((entry) => ({ id: entry.id, title: entry.title })),
      questionHits: questionHits.map((entry) => ({ id: entry.id, questionText: entry.questionText })),
    };
  }
}
