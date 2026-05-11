import { RefreshCw, Settings } from 'lucide-react';

interface AppHeaderProps {
  connectionLabel: string;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export function AppHeader({ connectionLabel, onRefresh, onOpenSettings }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <h1>Helpdesk Assistant</h1>
        <p>{connectionLabel}</p>
      </div>
      <div className="icon-actions">
        <button type="button" className="icon-button" onClick={onRefresh} aria-label="Refresh post context">
          <RefreshCw size={16} />
        </button>
        <button type="button" className="icon-button" onClick={onOpenSettings} aria-label="Open settings">
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
