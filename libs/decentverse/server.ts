import { AssetModule } from "./lib/asset/_server";
import { BatchModule, ScalarModule } from "./lib/_decentverse/_server";
import { CallRoomModule } from "./lib/callRoom/_server";
import { CharacterModule } from "./lib/character/_server";
import { CollisionModule } from "./lib/collision/_server";
import { DialogModule } from "./lib/dialog/_server";
import { DynamicModule } from "@nestjs/common";
import { EventsModule } from "./lib/events/_server";
import { LiveModule } from "./lib/live/_server";
import { MapModule } from "./lib/map/_server";
import { ModulesOptions } from "./lib/option";
import { PlacementModule } from "./lib/placement/_server";
import { RoleModule } from "./lib/role/_server";
import { RtModule } from "./lib/rt/_server";
import { SummaryModule } from "./lib/summary/_server";
import { TeleportModule } from "./lib/teleport/_server";
import { TileModule } from "./lib/tile/_server";
import { UserModule } from "./lib/user/_server";
import { WebviewModule } from "./lib/webview/_server";
import { registerModules as registerSharedModules } from "@shared/server";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...(!isChild ? registerSharedModules(options, true) : []),
    WebviewModule,
    PlacementModule,
    CollisionModule,
    LiveModule,
    TileModule,
    TeleportModule,
    ScalarModule,
    RoleModule,
    AssetModule,
    CharacterModule,
    MapModule,
    DialogModule,
    EventsModule,
    CallRoomModule,
    SummaryModule.register(!isChild),
    UserModule.register(!isChild),
    RtModule.register(options.redis),
  ] as DynamicModule[];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    BatchModule as unknown as DynamicModule,
    //
  ] as DynamicModule[];
  return modules;
};

export { environment } from "./env/environment";
export * as doc from "./lib/doc";
export * as cnst from "./lib/cnst";
export * as module from "./server";
export * as option from "./lib/option";
export * as sample from "./lib/sample";
export * as emp from "./lib/emp";
