import { Snapshot, SnapshotSummary } from "./snapshot.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const snapshotLocale = {
  ...baseLocale,
  field: ["Field", "필드"],
  totalSnapshot: ["TotalSnapshot", "총 스냅샷"],
} as const;

export type SnapshotLocale = Locale<"snapshot", Snapshot & SnapshotSummary, typeof snapshotLocale>;
