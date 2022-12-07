import { NestFactory } from "@nestjs/core";
import { AppModule, BatchAppModule } from "./module/app.module";
import { boot, bootBatch } from "@shared/util-server";
import { environment } from "./environments/environment";

const bootstrap = async () => {
  const serverMode = process.env.SERVER_MODE as "federation" | "batch" | "all" | null;
  if (serverMode === "federation") {
    const app = await NestFactory.create(AppModule.register(environment));
    await boot(app, environment);
  } else if (serverMode === "batch") {
    const app = await NestFactory.create(BatchAppModule.register(environment));
    await bootBatch(app, environment);
  } else if (serverMode === "all") {
    const app = await NestFactory.create(BatchAppModule.register(environment));
    await boot(app, environment);
  } else throw new Error("SERVER_MODE environment variable is not defined");
};
bootstrap();
