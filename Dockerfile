# Builder stage
FROM node:20-slim AS builder
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
FROM node:20-slim AS prod
WORKDIR /app
COPY package.json ./
COPY common/package.json ./common/
COPY backend/package.json ./backend/

ENV NODE_ENV=production
RUN npm install --omit=dev

COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/common/data ./node_modules/trucksim-completionist-common/data

CMD ["node", "backend/dist/app.js"]