FROM node:18.14.0-alpine
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN mkdir -p /workspace
RUN apk --no-cache add git
WORKDIR /workspace
RUN npx pnpm i --prod dotenv class-transformer class-validator reflect-metadata rxjs \
    mongoose aws-sdk axios dataloader lodash uuidv4 ioredis redis socket.io subscriptions-transport-ws discord.js sharp @socket.io/redis-adapter \
    graphql graphql-upload graphql-type-json graphql-tag graphql-redis-subscriptions graphql-subscriptions apollo-server-core apollo-server-express \
    @nestjs/common @nestjs/config @nestjs/schedule @nestjs/core @nestjs/platform-express @nestjs/websockets @nestjs/platform-socket.io @nestjs/mongoose @nestjs/graphql
COPY ./package.json ./package.json
RUN npx pnpm i --prod
COPY . .
CMD ["node", "main.js", "--max-old-space-size=8192"]
# CMD ["sleep", "36000"]