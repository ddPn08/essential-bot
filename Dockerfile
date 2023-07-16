FROM node:alpine3.18

RUN mkdir -p /app
WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm i
RUN pnpm tsup

CMD [ "node", "dist/index.js" ]
