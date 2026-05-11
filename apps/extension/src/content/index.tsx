import { detectPostContext, insertReply } from './domUtils';
import type { RuntimeMessage } from '../types';

const launcherId = 'helpdesk-assistant-launcher';

const defaultOverrides = {
  titleSelector: '',
  bodySelector: '',
  commentSelector: '',
};

function sendContext() {
  const context = detectPostContext(defaultOverrides);
  void chrome.runtime.sendMessage({ type: 'POST_CONTEXT_UPDATED', context } satisfies RuntimeMessage);
}

function mountLauncher() {
  if (document.getElementById(launcherId)) return;

  const host = document.createElement('div');
  host.id = launcherId;
  host.style.position = 'fixed';
  host.style.right = '16px';
  host.style.bottom = '16px';
  host.style.zIndex = '2147483647';

  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      button {
        border: 1px solid #c7d2fe;
        border-radius: 8px;
        background: #4f46e5;
        color: white;
        cursor: pointer;
        font: 600 13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 10px 12px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
      }
      button:hover { background: #4338ca; }
      button:focus { outline: 3px solid #a5b4fc; outline-offset: 2px; }
    </style>
    <button type="button" aria-label="Open Helpdesk Assistant">Helpdesk AI</button>
  `;

  shadow.querySelector('button')?.addEventListener('click', () => {
    sendContext();
    void chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' } satisfies RuntimeMessage);
  });

  document.documentElement.appendChild(host);
}

chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, sendResponse) => {
  if (message.type === 'REFRESH_POST_CONTEXT') {
    sendContext();
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === 'INSERT_REPLY') {
    const inserted = insertReply(message.reply, defaultOverrides.commentSelector);
    sendResponse({ ok: inserted });
    return true;
  }

  return false;
});

mountLauncher();
sendContext();
