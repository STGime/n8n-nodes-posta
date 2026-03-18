# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

n8n community node package for the [Posta](https://getposta.app) social media management API. Provides a single n8n node ("Posta") with 7 resources (Post, Media, Social Account, Analytics, Platform, User, Webhook) and their operations.

## Commands

```bash
pnpm install          # Install dependencies (pnpm is enforced via preinstall hook)
pnpm build            # Compile TypeScript + copy SVG icons to dist/
pnpm dev              # Watch mode TypeScript compilation
pnpm test             # Run Jest tests
pnpm lint             # ESLint check on nodes/ and credentials/
pnpm lintfix          # ESLint auto-fix
pnpm format           # Prettier format nodes/ and credentials/
```

Publishing happens via GitHub Actions on release (`.github/workflows/publish.yml`).

## Architecture

### Node structure (n8n conventions)

- `credentials/PostaApi.credentials.ts` — Credential type supporting API token or email/password auth
- `nodes/Posta/Posta.node.ts` — Main node class. Defines resources, properties, `loadOptions` methods, and routes `execute()` to per-resource action modules
- `nodes/Posta/GenericFunctions.ts` — Shared API helpers: `postaApiRequest` (single call with JWT caching + 401 retry) and `postaApiRequestAllItems` (offset-based pagination)
- `nodes/Posta/descriptions/` — UI field definitions per resource (operations, fields, displayOptions). Each exports `*Operations` and `*Fields` arrays
- `nodes/Posta/actions/` — Execution logic per resource. Each has an `index.ts` exporting an `execute(operation, itemIndex)` function

### Key patterns

- **Auth flow**: `GenericFunctions.ts` handles two auth modes. API token is passed as Bearer header. Email/password uses JWT with module-level caching (55 min TTL) and automatic retry on 401.
- **Pagination**: `postaApiRequestAllItems` uses `limit`/`offset` query params, reads `items` and `total` from responses.
- **Platform configs**: Post create/update builds per-platform config objects (TikTok, Pinterest, YouTube, etc.) from n8n `collection` fields. Comma-separated strings are split into arrays where the API expects arrays.
- **Media upload**: 3-step signed URL flow (request URL → PUT binary → confirm).
- **Platform resource**: Public endpoints (no auth required) — credential `displayOptions` exclude it.

### Test structure

Tests are in `test/` using Jest with ts-jest. Current tests validate node metadata (resource count, operation count, credentials, loadOptions).
