import { DynamicModule, Global, Module } from "@nestjs/common";
import { LuniverseEmployee } from "./luniverse.employee";
import { MocOptions } from "../option";
import axios from "axios";
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
        LuniverseEmployee,
      ],
      exports: [LuniverseEmployee],
    };
  }
}
