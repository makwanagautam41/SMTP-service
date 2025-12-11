FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ---- Production Image ----
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

RUN npm install -g pm2

COPY ecosystem.config.js .

USER node

EXPOSE 5001

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
