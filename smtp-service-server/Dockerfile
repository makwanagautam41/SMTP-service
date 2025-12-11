FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm install -g pm2

COPY ecosystem.config.js .

EXPOSE 5001

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
