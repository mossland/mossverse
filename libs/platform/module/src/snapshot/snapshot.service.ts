import { Injectable, Logger, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Snapshot from "./snapshot.model";
import * as fs from "fs";
import { Id, LoadService } from "@shared/util-server";
import { Utils } from "@shared/util";
import * as db from "../db";
import * as gql from "../gql";
import { srv as shared } from "@shared/module";
@Injectable()
export class SnapshotService extends LoadService<Snapshot.Mdl, Snapshot.Doc, Snapshot.Input> {
  constructor(
    @InjectModel(Snapshot.name)
    private readonly Snapshot: Snapshot.Mdl,
    private readonly contractService: shared.ContractService
  ) {
    super(SnapshotService.name, Snapshot);
  }
  async takeContractSnapshot(
    archiveType: "periodic" | "non-periodic" = "non-periodic",
    contractId: Id,
    wallets?: Id[]
  ): Promise<Snapshot.Doc> {
    const ownerships = (await this.contractService.snapshot(contractId, wallets)) as unknown as gql.shared.Ownership[];
    return await this.Snapshot.archive(archiveType, { targetType: "contract", target: contractId, ownerships });
  }
  async summarize(): Promise<gql.SnapshotSummary> {
    return {
      totalSnapshot: await this.Snapshot.countDocuments({ status: { $ne: "inactive" } }),
    };
  }
}
