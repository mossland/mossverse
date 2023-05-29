"use client";
import * as Advertise from "./_client";
import { DataEditModal, DataListContainer } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";
import { fetch } from "@mossland/client";

export const Admin = ({ sliceName = "advertise", init }: ModelsProps<fetch.Advertise>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Advertise.Unit.Admin}
      renderDashboard={Advertise.Util.Stat}
      queryMap={fetch.advertiseQueryMap}
      edit={
        <DataEditModal
          sliceName={sliceName}
          renderTitle={
            (advertise: DefaultOf<fetch.Advertise>) => "" // `${advertise.field}`
          }
        >
          <Advertise.Edit.General />
        </DataEditModal>
      }
      type="list"
      columns={["type", { key: "field", render: (field: string) => <span>{field}</span> }, "status", "createdAt"]}
      actions={(advertise: fetch.LightAdvertise, idx) => ["remove", "edit"]}
    />
  );
};
