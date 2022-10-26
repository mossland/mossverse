FROM node:16.16.0
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN mkdir -p /workspace
WORKDIR /workspace
ENV PORT 4200
RUN npm i -g next
RUN npm i --omit=dev --legacy-peer-deps dotenv class-transformer class-validator reflect-metadata rxjs \
    graphql graphql-tag apollo-upload-client moment-timezone react-toastify \
    next path postcss react react-dom react-i18next tailwindcss zustand
COPY ./package.json ./package.json
RUN npm i --legacy-peer-deps
COPY . .
CMD npm start
# CMD ["sleep", "36000"]