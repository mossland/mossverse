import { INestApplication, Logger } from "@nestjs/common";
import { RedisIoAdapter, LoggingInterceptor } from "./middlewares";
import { graphqlUploadExpress } from "graphql-upload";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export interface ApplicationOptions {
  port: number;
  globalPrefix?: string;
  redis?: RedisOptions;
}
export interface RedisOptions {
  url?: string;
  username?: string;
  password?: string;
}
export const boot = async (app: INestApplication, options: ApplicationOptions) => {
  // if (options.globalPrefix) app.setGlobalPrefix(options.globalPrefix);
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders:
      "DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,signmessage,signchain,signaddress",
  });
  if (options.redis) {
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis(options.redis.url);
    app.useWebSocketAdapter(redisIoAdapter);
  }
  app.use(graphqlUploadExpress());
  app.useGlobalInterceptors(new LoggingInterceptor());
  const config = new DocumentBuilder()
    .setTitle("Decentverse API")
    .setDescription("Decentverse API Description")
    .setVersion("1.0")
    .addTag("users")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const port = options.port;
  await app.listen(port);
  Logger.log(`🚀 Server is running on: ${await app.getUrl()}`);
};
