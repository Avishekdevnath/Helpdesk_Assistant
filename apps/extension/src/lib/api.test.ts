import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createBackendClient } from './api';

describe('backend api client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends api key and post content to generate reply', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ mode: 'full_answer', reply: 'Hi', kbHits: [], questionHits: [] }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const client = createBackendClient({ backendUrl: 'http://localhost:3000', apiKey: 'secret' });

    const reply = await client.generateReply({ postTitle: 'Title', postBody: 'Body', postUrl: 'https://x.test' });

    expect(reply.reply).toBe('Hi');
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/ai/generate-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'secret' },
      body: JSON.stringify({ postTitle: 'Title', postBody: 'Body', postUrl: 'https://x.test' }),
    });
  });

  it('throws a readable error for backend failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Unauthorized', { status: 401 }));
    const client = createBackendClient({ backendUrl: 'http://localhost:3000', apiKey: 'bad' });

    await expect(client.testConnection()).rejects.toThrow('Backend request failed: 401 Unauthorized');
  });
});
