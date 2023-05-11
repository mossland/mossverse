import { NestFactory } from "@nestjs/core";
import { AppModule, BatchAppModule } from "./module/app.module";
import { boot, bootBatch } from "@shared/util-server";
import { environment } from "./environments/environment";
import { LuniverseService } from "./module/srv";

const bootstrap = async () => {
  const serverMode = process.env.SERVER_MODE as "federation" | "batch" | "all" | null;
  if (serverMode === "federation") {
    const app = await NestFactory.create(AppModule.register(environment));
    await boot(app, environment);
    // const luniverseService = app.get<LuniverseService>(LuniverseService);
    // await luniverseService.transfer(
    //   "0x686b55be70fc489dc1a6dc8dafbcec4dab06a8df",
    //   "0x5741d9a7d25e6cd4f3ab53473df8c54c8bfc1ec9",
    //   1
    // );
  } else if (serverMode === "batch") {
    const app = await NestFactory.create(BatchAppModule.register(environment));
    await bootBatch(app, environment);
  } else if (serverMode === "all") {
    const app = await NestFactory.create(BatchAppModule.register(environment));
    await boot(app, environment);
  } else throw new Error("SERVER_MODE environment variable is not defined");
};
bootstrap();
