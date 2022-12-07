import { Global, Module } from "@nestjs/common";
import { TokenItemResolver } from "./tokenItem.resolver";
import { ThingItemResolver } from "./thingItem.resolver";
import { OwnershipResolver } from "./ownership.resolver";

@Global()
@Module({
  providers: [TokenItemResolver, ThingItemResolver, OwnershipResolver],
})
export class ScalarModule {}
