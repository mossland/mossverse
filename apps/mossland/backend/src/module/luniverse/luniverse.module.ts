import { Global, DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LuniverseService } from "./luniverse.service";
import axios, { AxiosInstance } from "axios";
import { MocOptions } from "../option";
@Global()
@Module({})
export class LuniverseModule {
  static register(options?: MocOptions): DynamicModule {
    return {
      module: LuniverseModule,
      providers: [
        {
          provide: "LUNIVERSE_API",
          useFactory: async () => {
            const api = axios.create({
              baseURL: `https://api.luniverse.io`,
              timeout: 20000,
              headers: { "Content-Type": "application/json" },
            });
            const res = await api.post(`/tx/v2.0/auth-tokens`, options?.luniverse);
            const token = res.data.data.authToken.token;
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            return api;
          },
        },
        LuniverseService,
      ],
      exports: [LuniverseService],
    };
  }
}
