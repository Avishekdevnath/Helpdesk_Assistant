import type { KbEntry, QuestionEntry, ReplyMode } from '@helpdesk/shared-types';

export function decideMode(questionHits: Pick<QuestionEntry, 'type'>[]): ReplyMode {
  if (questionHits.length === 0) return 'full_answer';
  return questionHits[0].type === 'assignment' ? 'hint_assignment' : 'hint_practice';
}

export function buildPrompt(
  mode: ReplyMode,
  post: { title: string; body: string },
  kb: Pick<KbEntry, 'title' | 'content'>[],
  questions: Pick<QuestionEntry, 'questionText' | 'hint1' | 'hint2'>[],
): string {
  const kbBlock = kb.length
    ? kb.map((entry) => `### ${entry.title}\n${entry.content}`).join('\n\n')
    : '(no KB context)';
  const questionBlock = questions.length
    ? questions
        .map(
          (question) =>
            `Q: ${question.questionText}\nHint 1: ${question.hint1}${
              question.hint2 ? `\nHint 2: ${question.hint2}` : ''
            }`,
        )
        .join('\n\n')
    : '(no matching assignment or practice question)';
  const postBlock = `Title: ${post.title}\nBody: ${post.body}`;

  switch (mode) {
    case 'full_answer':
      return [
        'You are an expert edutech moderator.',
        `KB context:\n${kbBlock}`,
        `Post:\n${postBlock}`,
        'Write a clear, helpful, encouraging reply. Cite KB when relevant.',
      ].join('\n\n');
    case 'hint_assignment':
      return [
        'You are an expert edutech moderator.',
        'This is a GRADED assignment question. Do NOT solve it.',
        `Question context:\n${questionBlock}`,
        `Post:\n${postBlock}`,
        'Use the Socratic method. Give a hint that points toward the next step. Never reveal the final answer.',
      ].join('\n\n');
    case 'hint_practice':
      return [
        'You are an expert edutech moderator.',
        'This is a practice question. Encourage exploration.',
        `Question context:\n${questionBlock}`,
        `Post:\n${postBlock}`,
        'Give a hint and point to the relevant concept. Do not solve it fully.',
      ].join('\n\n');
  }
}
