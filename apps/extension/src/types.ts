import type { GenerateReplyResponse } from '@helpdesk/shared-types';

export type DetectionState = 'detected' | 'partial' | 'missing';

export interface PostContext {
  title: string;
  body: string;
  url: string;
  hasCommentBox: boolean;
  detectedAt: number;
}

export interface ExtensionSettings {
  backendUrl: string;
  apiKey: string;
  moderatorId: string;
  titleSelector: string;
  bodySelector: string;
  commentSelector: string;
}

export interface TabState {
  tabId: number;
  context: PostContext | null;
  draftReply: string;
  lastReply: GenerateReplyResponse | null;
}

export type RuntimeMessage =
  | { type: 'POST_CONTEXT_UPDATED'; context: PostContext }
  | { type: 'GET_ACTIVE_TAB_STATE' }
  | { type: 'ACTIVE_TAB_STATE'; state: TabState | null }
  | { type: 'REFRESH_POST_CONTEXT' }
  | { type: 'INSERT_REPLY'; reply: string }
  | { type: 'OPEN_SIDE_PANEL' };

export const defaultSettings: ExtensionSettings = {
  backendUrl: 'http://localhost:3000',
  apiKey: '',
  moderatorId: 'moderator',
  titleSelector: '',
  bodySelector: '',
  commentSelector: '',
};
