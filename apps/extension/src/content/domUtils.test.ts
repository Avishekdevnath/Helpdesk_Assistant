import { describe, expect, it } from 'vitest';
import { detectPostContext, insertReply } from './domUtils';

describe('domUtils', () => {
  it('detects title, body, and comment textarea with fallback selectors', () => {
    document.body.innerHTML = `
      <main>
        <h1>Promise chaining issue</h1>
        <article>I am confused about then callbacks.</article>
        <textarea aria-label="Comment"></textarea>
      </main>
    `;

    const context = detectPostContext({
      titleSelector: '',
      bodySelector: '',
      commentSelector: '',
    });

    expect(context.title).toBe('Promise chaining issue');
    expect(context.body).toBe('I am confused about then callbacks.');
    expect(context.hasCommentBox).toBe(true);
  });

  it('uses selector overrides before fallback selectors', () => {
    document.body.innerHTML = `
      <h1>Wrong title</h1>
      <div data-post-title>Correct title</div>
      <div data-post-body>Correct body</div>
      <div contenteditable="true" data-comment-box></div>
    `;

    const context = detectPostContext({
      titleSelector: '[data-post-title]',
      bodySelector: '[data-post-body]',
      commentSelector: '[data-comment-box]',
    });

    expect(context.title).toBe('Correct title');
    expect(context.body).toBe('Correct body');
    expect(context.hasCommentBox).toBe(true);
  });

  it('inserts into textarea and dispatches input/change events', () => {
    document.body.innerHTML = `<textarea aria-label="Comment"></textarea>`;
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const events: string[] = [];
    textarea.addEventListener('input', () => events.push('input'));
    textarea.addEventListener('change', () => events.push('change'));

    const inserted = insertReply('Draft answer', '');

    expect(inserted).toBe(true);
    expect(textarea.value).toBe('Draft answer');
    expect(events).toEqual(['input', 'change']);
  });
});
