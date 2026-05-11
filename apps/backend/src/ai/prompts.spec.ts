import { buildPrompt, decideMode } from './prompts';

describe('AI prompts', () => {
  it('uses full_answer when no question hits exist', () => {
    expect(decideMode([])).toBe('full_answer');
  });

  it('uses assignment hint mode for assignment hits', () => {
    expect(decideMode([{ type: 'assignment' }] as never)).toBe('hint_assignment');
  });

  it('builds assignment prompts that forbid direct answers', () => {
    const prompt = buildPrompt(
      'hint_assignment',
      { title: 'Help', body: 'Solve Q1' },
      [],
      [{ questionText: 'Q1', hint1: 'Start with a loop' }] as never,
    );

    expect(prompt).toContain('GRADED assignment');
    expect(prompt).toContain('Do NOT solve it');
  });
});
