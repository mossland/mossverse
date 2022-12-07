import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InventoryService } from "./inventory.service";
import { InventoryResolver } from "./inventory.resolver";
import { ItemOptions } from "../option";
@Global()
@Module({})
export class InventoryModule {
  static register(options?: ItemOptions): DynamicModule {
    return {
      module: InventoryModule,
      imports: [],
      providers: [{ provide: "ITEM_OPTIONS", useValue: options }, InventoryService, InventoryResolver],
      exports: [InventoryService],
    };
  }
}
