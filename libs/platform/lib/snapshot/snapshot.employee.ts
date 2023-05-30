import * as Snapshot from "./snapshot.document";
import * as cnst from "../cnst";
import { Id, LoadService } from "@util/server";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { emp as shared } from "@shared/server";
@Injectable()
export class SnapshotEmployee extends LoadService<Snapshot.Mdl, Snapshot.Doc, Snapshot.Input> {
  constructor(
    @InjectModel(Snapshot.name)
    private readonly Snapshot: Snapshot.Mdl,
    private readonly contractEmployee: shared.ContractEmployee
  ) {
    super(SnapshotEmployee.name, Snapshot);
  }
  async takeContractSnapshot(
    archiveType: "periodic" | "non-periodic" = "non-periodic",
    contractId: Id,
    wallets?: Id[]
  ): Promise<Snapshot.Doc> {
    const ownerships = (await this.contractEmployee.snapshot(
      contractId,
      wallets
    )) as unknown as cnst.shared.Ownership[];
    return await this.Snapshot.archive(archiveType, {
      targetType: "contract",
      target: contractId,
      ownerships,
    });
  }
  async summarize(): Promise<cnst.SnapshotSummary> {
    return {
      totalSnapshot: await this.Snapshot.countDocuments({
        status: { $ne: "inactive" },
      }),
    };
  }
}
