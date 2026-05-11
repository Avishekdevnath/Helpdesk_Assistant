import { useEffect, useMemo, useState } from 'react';
import type { GenerateReplyResponse } from '@helpdesk/shared-types';
import { createBackendClient } from '../lib/api';
import { loadSettings, saveSettings, sendRuntimeMessage } from '../lib/chrome';
import { defaultSettings, type ExtensionSettings, type RuntimeMessage, type TabState } from '../types';
import { AppHeader } from './components/AppHeader';
import { ContextHits } from './components/ContextHits';
import { PostContextCard } from './components/PostContextCard';
import { ReplyComposer } from './components/ReplyComposer';
import { SettingsPanel } from './components/SettingsPanel';
import './sidepanel.css';

export function SidePanel() {
  const [settings, setSettings] = useState<ExtensionSettings>(defaultSettings);
  const [tabState, setTabState] = useState<TabState | null>(null);
  const [reply, setReply] = useState('');
  const [lastReply, setLastReply] = useState<GenerateReplyResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [status, setStatus] = useState('Loading');

  const client = useMemo(
    () => createBackendClient({ backendUrl: settings.backendUrl, apiKey: settings.apiKey }),
    [settings.backendUrl, settings.apiKey],
  );
  const context = tabState?.context ?? null;
  const canGenerate = Boolean(settings.backendUrl && settings.apiKey && context?.title && context.body);
  const canInsert = Boolean(reply && context?.hasCommentBox);
  const canSave = Boolean(reply && settings.backendUrl && settings.apiKey && context?.title && context.body);

  useEffect(() => {
    void loadSettings().then((loaded) => {
      setSettings(loaded);
      setStatus(loaded.apiKey ? 'Ready' : 'Missing API key');
    });
    void refreshState();
  }, []);

  async function refreshState() {
    const response = await sendRuntimeMessage<{ state: TabState | null }>({ type: 'GET_ACTIVE_TAB_STATE' });
    setTabState(response.state);
  }

  async function updateSettings(next: ExtensionSettings) {
    setSettings(next);
    await saveSettings(next);
    setStatus(next.apiKey ? 'Ready' : 'Missing API key');
  }

  async function refreshPost() {
    await sendRuntimeMessage({ type: 'REFRESH_POST_CONTEXT' } satisfies RuntimeMessage);
    window.setTimeout(() => void refreshState(), 250);
  }

  async function generateReply() {
    if (!context) return;
    setIsGenerating(true);
    try {
      const response = await client.generateReply({
        postTitle: context.title,
        postBody: context.body,
        postUrl: context.url,
      });
      setLastReply(response);
      setReply(response.reply);
      setStatus('Ready');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to generate reply');
    } finally {
      setIsGenerating(false);
    }
  }

  async function insertReply() {
    await sendRuntimeMessage({ type: 'INSERT_REPLY', reply } satisfies RuntimeMessage);
  }

  async function saveToKb() {
    if (!context) return;
    try {
      await client.savePost({
        postTitle: context.title,
        postBody: context.body,
        comment: reply,
        url: context.url,
        savedBy: settings.moderatorId,
      });
      setStatus('Saved to KB');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to save to KB');
    }
  }

  async function testConnection() {
    try {
      await client.testConnection();
      setStatus('Connected');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Connection failed');
    }
  }

  return (
    <main className="sidepanel-shell">
      <AppHeader connectionLabel={status} onRefresh={refreshPost} onOpenSettings={() => setShowSettings((value) => !value)} />
      <PostContextCard context={context} />
      <ReplyComposer
        reply={reply}
        mode={lastReply?.mode ?? null}
        isGenerating={isGenerating}
        canGenerate={canGenerate}
        canInsert={canInsert}
        canSave={canSave}
        onGenerate={generateReply}
        onReplyChange={setReply}
        onInsert={insertReply}
        onSave={saveToKb}
      />
      <ContextHits reply={lastReply} />
      {showSettings || !settings.apiKey ? (
        <SettingsPanel settings={settings} onChange={updateSettings} onTestConnection={testConnection} />
      ) : null}
    </main>
  );
}
