import { module as shared } from "@shared/module";
import { ModulesOptions } from "./option";
import { UserModule } from "./user/user.module";
import { AssetModule } from "./asset/asset.module";
import { DialogModule } from "./dialog/dialog.module";
import { CharacterModule } from "./character/character.module";
import { MapModule } from "./map/map.module";
import { RtModule } from "./rt/rt.module";
import { EventsModule } from "./events/events.module";
import { RoleModule } from "./role/role.module";
import { WebviewModule } from "./webview/webview.module";
import { PlacementModule } from "./placement/placement.module";
import { CollisionModule } from "./collision/collision.module";
import { LiveModule } from "./live/live.module";
import { TileModule } from "./tile/tile.module";
import { TeleportModule } from "./teleport/teleport.module";
import { ScalarModule } from "./_scalar/scalar.module";
import { CallRoomModule } from "./callRoom/callRoom.module";
import { BatchModule } from "./batch/batch.module";
import { SummaryModule } from "./summary/summary.module";
import { DynamicModule } from "@nestjs/common";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...(!isChild ? shared.registerModules(options, true) : []),
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
