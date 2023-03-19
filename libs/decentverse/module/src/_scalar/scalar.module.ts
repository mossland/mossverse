import { Global, Module } from "@nestjs/common";
import { AreaResolver } from "./area.resolver";
import { FlowResolver } from "./flow.resolver";
import { DialogueResolver } from "./dialogue.resolver";

@Global()
@Module({
  providers: [
    AreaResolver,
    FlowResolver,
    //  DialogueResolver
  ],
})
export class ScalarModule {}
