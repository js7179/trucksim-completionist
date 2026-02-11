# Builder stage
FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY common/package.json ./common/
COPY backend/package.json ./backend/

COPY common/ ./common/
COPY backend/ ./backend/

RUN npm install
RUN npm run build --workspace=common
RUN npm run build --workspace=backend

# Prod stage
FROM node:24-slim AS prod
WORKDIR /app
COPY package.json ./
COPY common/package.json ./common/
COPY backend/package.json ./backend/

ENV NODE_ENV=production
RUN npm install --omit=dev

RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/common/data ./node_modules/trucksim-completionist-common/data

ENV PORT=3000
# Do not expose Healthcheck port
ENV HEALTHCHECK_PORT=3001
USER node
CMD ["node", "./backend/dist/app.js"]
HEALTHCHECK --interval=60s --timeout=30s --start-period=5s --retries=3 CMD curl -fsSL http://localhost:$HEALTHCHECK_PORT/health || exit 1