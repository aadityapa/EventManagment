FROM node:22-alpine AS base
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci
COPY server ./server
COPY prisma ./prisma
RUN cd server && npx prisma generate --schema=../prisma/schema.prisma
RUN cd server && npm run build
# Secrets come from the runtime environment (docker-compose / host), never a
# copied .env.example — that left NEXTAUTH_SECRET empty.
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "server/dist/index.js"]
