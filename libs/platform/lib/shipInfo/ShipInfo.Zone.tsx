"use client";
import * as ShipInfo from "./_client";
import { DataEditModal, DataListContainer } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";
import { fetch } from "@platform/client";

export const Admin = ({ sliceName = "shipInfo", init }: ModelsProps<fetch.ShipInfo>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={ShipInfo.Unit.Admin}
      renderDashboard={ShipInfo.Util.Stat}
      queryMap={fetch.shipInfoQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(shipInfo: DefaultOf<fetch.ShipInfo>) => `${shipInfo.id}`}>
          <ShipInfo.Edit.General sliceName={sliceName} />
        </DataEditModal>
      }
      type="list"
      columns={["type", "status", "createdAt"]}
      actions={(shipInfo: fetch.LightShipInfo, idx) => ["remove", "edit"]}
    />
  );
};
