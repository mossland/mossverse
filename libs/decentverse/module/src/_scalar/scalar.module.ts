import { Global, Module } from "@nestjs/common";
import { PlacementResolver } from "./placement.resolver";
import { TileResolver } from "./tile.resolver";
import { AreaResolver } from "./area.resolver";
import { FlowResolver } from "./flow.resolver";
import { DialogueResolver } from "./dialogue.resolver";
import { HotkeyResolver } from "./hotkey.resolver";

@Global()
@Module({
  providers: [TileResolver, AreaResolver, FlowResolver, DialogueResolver, PlacementResolver, HotkeyResolver],
})
export class ScalarModule {}
