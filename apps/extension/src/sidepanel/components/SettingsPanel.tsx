import { useState } from 'react';
import type { ExtensionSettings } from '../../types';

interface SettingsPanelProps {
  settings: ExtensionSettings;
  onChange: (settings: ExtensionSettings) => void;
  onTestConnection: () => void;
}

export function SettingsPanel({ settings, onChange, onTestConnection }: SettingsPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  function update<K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  const hasApiKey = Boolean(settings.apiKey);

  return (
    <section className="panel-section settings-panel">
      <h2>Settings</h2>

      {/* API Key Setup Section */}
      <div className="settings-section">
        <div className="section-header">
          <h3>Access & Authentication</h3>
          {hasApiKey && <span className="status-badge success">✓ Configured</span>}
          {!hasApiKey && <span className="status-badge warning">⚠ Required</span>}
        </div>

        <label className="field-label" htmlFor="api-key">
          API Key
          <span className="required-indicator">*</span>
        </label>
        <p className="field-description">
          Your unique API key grants access to the knowledge base and AI reply generation features. Request this from your admin.
        </p>
        <div className="input-group">
          <input
            id="api-key"
            type={showPassword ? 'text' : 'password'}
            value={settings.apiKey}
            onChange={(event) => update('apiKey', event.target.value)}
            placeholder="hd_sk_..."
            className={hasApiKey ? 'has-value' : ''}
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide' : 'Show'}
            aria-label={showPassword ? 'Hide API key' : 'Show API key'}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>

        <label className="field-label" htmlFor="backend-url">
          Backend URL
          <span className="required-indicator">*</span>
        </label>
        <p className="field-description">
          Location of your helpdesk backend server (e.g., http://localhost:3000 for local dev)
        </p>
        <input
          id="backend-url"
          type="url"
          value={settings.backendUrl}
          onChange={(event) => update('backendUrl', event.target.value)}
          placeholder="http://localhost:3000"
        />

        <button type="button" className="primary-button test-button" onClick={onTestConnection}>
          🔗 Test Connection
        </button>
      </div>

      {/* Advanced Settings Section */}
      <div className="settings-section">
        <details className="collapsible-section">
          <summary className="section-header">
            <h3>Advanced Settings</h3>
          </summary>

          <label className="field-label" htmlFor="moderator-id">
            Moderator ID
          </label>
          <p className="field-description">Your unique identifier in the system</p>
          <input
            id="moderator-id"
            value={settings.moderatorId}
            onChange={(event) => update('moderatorId', event.target.value)}
            placeholder="moderator"
          />

          <label className="field-label" htmlFor="title-selector">
            Title CSS Selector
          </label>
          <p className="field-description">CSS selector for the post title element on your helpdesk page</p>
          <input
            id="title-selector"
            value={settings.titleSelector}
            onChange={(event) => update('titleSelector', event.target.value)}
            placeholder="h1.post-title"
          />

          <label className="field-label" htmlFor="body-selector">
            Body CSS Selector
          </label>
          <p className="field-description">CSS selector for the post content element on your helpdesk page</p>
          <input
            id="body-selector"
            value={settings.bodySelector}
            onChange={(event) => update('bodySelector', event.target.value)}
            placeholder="div.post-body"
          />

          <label className="field-label" htmlFor="comment-selector">
            Comment Box CSS Selector
          </label>
          <p className="field-description">CSS selector for the comment input element on your helpdesk page</p>
          <input
            id="comment-selector"
            value={settings.commentSelector}
            onChange={(event) => update('commentSelector', event.target.value)}
            placeholder="textarea.comment-input"
          />
        </details>
      </div>
    </section>
  );
}
