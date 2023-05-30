import * as Snapshot from "./snapshot.document";
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SnapshotEmployee } from "./snapshot.employee";
import { SnapshotResolver } from "./snapshot.endpoint";

@Global()
@Module({
  imports: [MongooseModule.forFeatureAsync([{ name: Snapshot.name, useFactory: Snapshot.middleware() }])],
  providers: [SnapshotEmployee, SnapshotResolver],
  exports: [SnapshotEmployee],
})
export class SnapshotModule {}
