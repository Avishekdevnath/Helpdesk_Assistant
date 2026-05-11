import type { ManifestV3Export } from '@crxjs/vite-plugin';

export const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Helpdesk Assistant',
  version: '0.0.1',
  description: 'AI moderator assistant for Phitron helpdesk.',
  action: {
    default_title: 'Open Helpdesk Assistant',
  },
  permissions: ['sidePanel', 'storage', 'tabs', 'activeTab'],
  host_permissions: ['https://helpdesk.phitron.io/*'],
  side_panel: {
    default_path: 'index.html',
  },
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://helpdesk.phitron.io/*'],
      js: ['src/content/index.tsx'],
      run_at: 'document_idle',
    },
  ],
};
