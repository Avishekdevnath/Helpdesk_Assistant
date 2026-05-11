import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SidePanel } from './SidePanel';

vi.mock('../lib/chrome', () => ({
  loadSettings: vi.fn().mockResolvedValue({
    backendUrl: 'http://localhost:3000',
    apiKey: '',
    moderatorId: 'moderator',
    titleSelector: '',
    bodySelector: '',
    commentSelector: '',
  }),
  saveSettings: vi.fn().mockResolvedValue(undefined),
  sendRuntimeMessage: vi.fn().mockResolvedValue({ state: null }),
}));

describe('SidePanel', () => {
  it('shows missing API key configuration state', async () => {
    render(<SidePanel />);

    expect(await screen.findByText('Missing API key')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate reply/i })).toBeDisabled();
  });
});
