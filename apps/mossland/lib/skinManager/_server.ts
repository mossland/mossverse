import { Global, Module } from "@nestjs/common";
import { SkinManagerResolver } from "./skinManager.endpoint";
import { SkinManagerEmployee } from "./skinManager.employee";

@Global()
@Module({
  imports: [],
  providers: [SkinManagerEmployee, SkinManagerResolver],
  exports: [SkinManagerEmployee],
})
export class SkinManagerModule {}
