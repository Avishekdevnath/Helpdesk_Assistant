# Helpdesk Bot

EduTech help-desk AI moderator. Monorepo: `apps/backend` (NestJS) and future `apps/extension`.

## Setup

```bash
pnpm install
cp .env.example apps/backend/.env
# fill DATABASE_URL, DIRECT_URL, OPENAI_API_KEY, HELPDESK_API_KEY
pnpm --filter backend prisma:migrate
pnpm dev:backend
```

## Test

```bash
pnpm test
pnpm test:e2e
```

## Extension

```bash
pnpm install
pnpm --filter extension build
```

Load `apps/extension/dist` as an unpacked extension in Chrome.

The extension is scoped to `https://helpdesk.phitron.io/*` and uses Chrome Side Panel API.

Configure the side panel with:

- Backend URL, for local development usually `http://localhost:3000`
- `HELPDESK_API_KEY`
- Moderator ID
