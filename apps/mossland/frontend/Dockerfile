FROM node:18.14.0-alpine
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN mkdir -p /workspace
RUN apk --no-cache add git
WORKDIR /workspace
ENV PORT 4200
RUN npm i -g next pnpm
RUN npx pnpm i --prod dotenv class-transformer class-validator reflect-metadata rxjs \
    graphql graphql-tag dayjs antd \
    next path postcss react react-dom react-i18next tailwindcss zustand
COPY ./package.json ./package.json
RUN npx pnpm i --prod
COPY . .
CMD npm start
# CMD ["sleep", "36000"]