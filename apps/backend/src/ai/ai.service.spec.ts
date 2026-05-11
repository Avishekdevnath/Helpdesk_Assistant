import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AiService } from './ai.service';
import { KbService } from '../kb/kb.service';
import { QuestionsService } from '../questions/questions.service';

describe('AiService', () => {
  const kb = { search: jest.fn() };
  const questions = { search: jest.fn() };
  const config = { get: (key: string) => (key === 'OPENAI_API_KEY' ? 'sk-test' : undefined) };

  let service: AiService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: KbService, useValue: kb },
        { provide: QuestionsService, useValue: questions },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = moduleRef.get(AiService);
    (service as unknown as { client: unknown }).client = {
      responses: {
        create: jest.fn().mockResolvedValue({
          output_text: 'reply text',
        }),
      },
    };
  });

  it('returns full_answer when no question hits exist', async () => {
    kb.search.mockResolvedValue([]);
    questions.search.mockResolvedValue([]);

    const res = await service.generateReply({ postTitle: 't', postBody: 'b' });

    expect(res.mode).toBe('full_answer');
    expect(res.reply).toBe('reply text');
  });

  it('returns assignment hint mode when an assignment hit exists', async () => {
    kb.search.mockResolvedValue([]);
    questions.search.mockResolvedValue([{ id: 'q1', type: 'assignment', questionText: 'x', hint1: 'h' }]);

    const res = await service.generateReply({ postTitle: 't', postBody: 'b' });

    expect(res.mode).toBe('hint_assignment');
    expect(res.questionHits).toEqual([{ id: 'q1', questionText: 'x' }]);
  });
});
