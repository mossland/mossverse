/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/app.module";
import { boot } from "@shared/util-server";
import { environment } from "./environments/environment";

async function bootstrap() {
  const app = await NestFactory.create(AppModule.register(environment));
  await boot(app, environment);
}

bootstrap();
