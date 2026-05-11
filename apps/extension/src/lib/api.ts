import type { GenerateReplyRequest, GenerateReplyResponse } from '@helpdesk/shared-types';

interface ClientOptions {
  backendUrl: string;
  apiKey: string;
}

interface SavePostInput {
  postTitle: string;
  postBody: string;
  comment: string;
  url: string;
  savedBy: string;
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '');
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const statusText = response.statusText || fallbackStatusText(response.status);
    throw new Error(`Backend request failed: ${response.status} ${statusText}`);
  }
  return response.json() as Promise<T>;
}

function fallbackStatusText(status: number): string {
  if (status === 401) return 'Unauthorized';
  if (status === 403) return 'Forbidden';
  if (status === 404) return 'Not Found';
  if (status >= 500) return 'Server Error';
  return 'Error';
}

export function createBackendClient(options: ClientOptions) {
  const baseUrl = normalizeBaseUrl(options.backendUrl);
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': options.apiKey,
  };

  return {
    async generateReply(input: GenerateReplyRequest): Promise<GenerateReplyResponse> {
      const response = await fetch(`${baseUrl}/ai/generate-reply`, {
        method: 'POST',
        headers,
        body: JSON.stringify(input),
      });
      return readJson<GenerateReplyResponse>(response);
    },

    async savePost(input: SavePostInput) {
      const response = await fetch(`${baseUrl}/kb/from-post`, {
        method: 'POST',
        headers,
        body: JSON.stringify(input),
      });
      return readJson(response);
    },

    async testConnection() {
      const response = await fetch(`${baseUrl}/kb/search?q=healthcheck`, {
        method: 'GET',
        headers: { 'x-api-key': options.apiKey },
      });
      return readJson(response);
    },
  };
}
