import { module as shared } from "@shared/module";
import { ModulesOptions } from "./option";
import { UserModule } from "./user/user.module";
import { AssetModule } from "./asset/asset.module";
import { DialogModule } from "./dialog/dialog.module";
import { InventoryModule } from "./inventory/inventory.module";
import { CharacterModule } from "./character/character.module";
import { MapModule } from "./map/map.module";
import { RtModule } from "./rt/rt.module";
import { EventsModule } from "./events/events.module";
import { RoleModule } from "./role/role.module";
import { ScalarModule } from "./__scalar/scalar.module";
import { BatchModule } from "./batch/batch.module";
import { EmojiModule } from "./emoji/emoji.module";
import { DynamicModule } from "@nestjs/common";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    ...(!isChild ? shared.registerModules(options, true) : []),
    ScalarModule,
    RoleModule,
    AssetModule,
    UserModule.register(!isChild),
    CharacterModule,
    MapModule,
    DialogModule,
    EmojiModule,
    options.item && InventoryModule.register(options.item),
    EventsModule,
    BatchModule,
    options.redis && RtModule.register(options.redis),
  ].filter((module) => !!module) as DynamicModule[];
  return modules;
};
