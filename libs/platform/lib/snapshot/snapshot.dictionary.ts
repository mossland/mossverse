import { Snapshot, SnapshotSummary } from "./snapshot.fetch";
import { Translate, baseTrans } from "@util/client";

export const snapshotTrans = {
  ...baseTrans,
  field: ["Field", "필드"],
  totalSnapshot: ["TotalSnapshot", "총 스냅샷"],
} satisfies Translate<Snapshot & SnapshotSummary>;
