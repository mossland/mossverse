import * as Snapshot from "./_client";
import { DataEditModal, DataListContainer } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";
import { fetch } from "@platform/client";

export const Admin = ({ sliceName = "snapshot", init }: ModelsProps<fetch.Snapshot>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Snapshot.Unit.Admin}
      renderDashboard={Snapshot.Util.Stat}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(snapshot: DefaultOf<fetch.Snapshot>) => `${snapshot.field}`}>
          <Snapshot.Edit.General sliceName={sliceName} />
        </DataEditModal>
      }
      type="list"
      columns={["type", { key: "field", render: (field: string) => <span>{field}</span> }, "status", "createdAt"]}
      actions={(snapshot: fetch.LightSnapshot, idx) => [
        "remove",
        "edit",
        {
          type: "approve",
          render: () => <Snapshot.Util.Approve snapshot={snapshot} idx={idx} sliceName={sliceName} />,
        },
      ]}
    />
  );
};
