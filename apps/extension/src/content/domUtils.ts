import type { PostContext } from '../types';

interface SelectorOverrides {
  titleSelector: string;
  bodySelector: string;
  commentSelector: string;
}

const titleSelectors = ['[data-post-title]', 'h1', '[class*="title" i]'];
const bodySelectors = ['[data-post-body]', 'article', '[class*="content" i]', '[class*="body" i]'];
const commentSelectors = ['[data-comment-box]', 'textarea', '[contenteditable="true"]', '[role="textbox"]'];

function firstText(selectors: string[]): string {
  for (const selector of selectors) {
    if (!selector) continue;
    const element = document.querySelector(selector);
    const text = element?.textContent?.trim();
    if (text) return text;
  }
  return '';
}

function findCommentElement(selectorOverride: string): HTMLElement | null {
  const selectors = selectorOverride ? [selectorOverride, ...commentSelectors] : commentSelectors;
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) return element;
  }
  return null;
}

export function detectPostContext(overrides: SelectorOverrides): PostContext {
  const title = firstText(overrides.titleSelector ? [overrides.titleSelector, ...titleSelectors] : titleSelectors);
  const body = firstText(overrides.bodySelector ? [overrides.bodySelector, ...bodySelectors] : bodySelectors);

  return {
    title,
    body,
    url: window.location.href,
    hasCommentBox: Boolean(findCommentElement(overrides.commentSelector)),
    detectedAt: Date.now(),
  };
}

export function insertReply(reply: string, commentSelector: string): boolean {
  const element = findCommentElement(commentSelector);
  if (!element) return false;

  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    element.value = reply;
  } else {
    element.textContent = reply;
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}
