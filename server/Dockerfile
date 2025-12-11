FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# TypeScript をビルド
RUN npx tsc

# ビルドした JS を実行
CMD ["node", "dist/server.js"]
