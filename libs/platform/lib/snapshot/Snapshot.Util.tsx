"use client";
import * as Snapshot from "./_client";
import { AiOutlineNumber, AiOutlineWarning } from "react-icons/ai";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { fetch } from "@platform/client";

export const Menu: DataMenuItem = {
  key: "snapshot",
  label: "Snapshot",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Snapshot.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "snapshot",
  queryMap = fetch.snapshotQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.SnapshotSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalSnapshot"]}
      hidePresents={hidePresents}
    />
  );
};

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface ApproveProps {
  sliceName?: string;
  snapshot: fetch.LightSnapshot;
  idx?: number;
}
export const Approve = ({ sliceName = "snapshot", snapshot, idx }: ApproveProps) => {
  return (
    <button
      className="gap-2 btn"
      // onClick={() => slice.do.processSnapshot(snapshot.id, idx)}
      onClick={() => null}
    >
      <AiOutlineNumber />
      Approve
    </button>
  );
};
