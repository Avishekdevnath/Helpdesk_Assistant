import type { PostContext, RuntimeMessage, TabState } from '../types';

const tabStates = new Map<number, TabState>();

chrome.runtime.onInstalled.addListener(() => {
  void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabStates.delete(tabId);
});

chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  void handleMessage(message, sender).then(sendResponse);
  return true;
});

async function getActiveTabId(): Promise<number | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id ?? null;
}

async function handleMessage(message: RuntimeMessage, sender: chrome.runtime.MessageSender) {
  if (message.type === 'POST_CONTEXT_UPDATED') {
    const tabId = sender.tab?.id;
    if (!tabId) return { ok: false };
    const existing = tabStates.get(tabId);
    tabStates.set(tabId, {
      tabId,
      context: message.context,
      draftReply: existing?.draftReply ?? '',
      lastReply: existing?.lastReply ?? null,
    });
    return { ok: true };
  }

  if (message.type === 'GET_ACTIVE_TAB_STATE') {
    const tabId = await getActiveTabId();
    return tabId ? { state: tabStates.get(tabId) ?? null } : { state: null };
  }

  if (message.type === 'OPEN_SIDE_PANEL') {
    const tabId = sender.tab?.id ?? (await getActiveTabId());
    if (!tabId) return { ok: false };
    await chrome.sidePanel.open({ tabId });
    return { ok: true };
  }

  if (message.type === 'REFRESH_POST_CONTEXT') {
    const tabId = await getActiveTabId();
    if (!tabId) return { ok: false };
    await chrome.tabs.sendMessage(tabId, message);
    return { ok: true };
  }

  if (message.type === 'INSERT_REPLY') {
    const tabId = await getActiveTabId();
    if (!tabId) return { ok: false };
    await chrome.tabs.sendMessage(tabId, message);
    return { ok: true };
  }

  return { ok: false };
}

export function updateTabDraft(tabId: number, context: PostContext, draftReply: string) {
  const existing = tabStates.get(tabId);
  tabStates.set(tabId, {
    tabId,
    context,
    draftReply,
    lastReply: existing?.lastReply ?? null,
  });
}
