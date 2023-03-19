import { Global, Module, DynamicModule, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Snapshot from "./snapshot.model";
import { SnapshotService } from "./snapshot.service";
import { SnapshotResolver } from "./snapshot.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Snapshot.name, useFactory: Snapshot.middleware() }])],
  providers: [SnapshotService, SnapshotResolver],
  exports: [SnapshotService],
})
export class SnapshotModule {}
