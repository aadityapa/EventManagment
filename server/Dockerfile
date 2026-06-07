FROM node:22-alpine AS base
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci
COPY server ./server
COPY prisma ./prisma
COPY .env.example .env
RUN cd server && npx prisma generate --schema=../prisma/schema.prisma
RUN cd server && npm run build
EXPOSE 4000
CMD ["node", "server/dist/index.js"]
