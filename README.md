# Paisa Flow

This repository is a Turborepo monorepo for Paisa Flow.

## Apps

- `apps/user-app`: user-facing Next.js app
- `apps/merchant-app`: merchant-facing Next.js app
- `apps/bank_webhook_handler`: webhook handler service

## Packages

- `packages/db`: Prisma database schema and seed scripts
- `packages/store`: shared Recoil/store utilities
- `packages/ui`: shared UI components
- `packages/eslint-config`: shared ESLint config
- `packages/typescript-config`: shared TypeScript config

## Local development

Install dependencies at the repo root and start Turbo.

```sh
npm install
npm run dev
```

## Build

Build all apps and packages:

```sh
npm run build
```

## Docker

A root `Dockerfile` is included for building and running one app from the workspace.

Build the default app (`apps/user-app`):

```sh
docker build -t paisa-flow .
```

Build the merchant app instead:

```sh
docker build --build-arg APP=apps/merchant-app -t paisa-flow .
```

Run the container:

```sh
docker run -p 3000:3000 paisa-flow
```

## Notes

- The repository uses npm workspaces and Turbo.
- `@repo/ui`, `@repo/store`, and `@repo/db` are shared workspace packages.
- `apps/user-app` and `apps/merchant-app` are both Next.js applications.
