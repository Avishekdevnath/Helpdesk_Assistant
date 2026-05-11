import { defaultSettings, type ExtensionSettings, type RuntimeMessage } from '../types';

const settingsKey = 'helpdeskAssistantSettings';

export async function loadSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.sync.get(settingsKey);
  return { ...defaultSettings, ...(result[settingsKey] as Partial<ExtensionSettings> | undefined) };
}

export async function saveSettings(settings: ExtensionSettings): Promise<void> {
  await chrome.storage.sync.set({ [settingsKey]: settings });
}

export async function sendRuntimeMessage<TResponse>(message: RuntimeMessage): Promise<TResponse> {
  return chrome.runtime.sendMessage(message) as Promise<TResponse>;
}
