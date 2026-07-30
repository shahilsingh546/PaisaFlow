# Build stage: install workspace dependencies and build a single app
FROM node:20-alpine AS base
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1
ENV APP=apps/user-app

FROM base AS deps
COPY package*.json turbo.json ./
COPY apps/user-app/package.json apps/user-app/package.json
COPY apps/merchant-app/package.json apps/merchant-app/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/store/package.json packages/store/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
RUN npm ci

FROM deps AS builder
COPY . .
RUN npm --workspace ${APP} run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV APP=apps/user-app
COPY --from=builder /app .
EXPOSE 3000
CMD ["sh", "-c", "npm --workspace $APP run start"]