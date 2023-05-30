"use client";
import * as Asset from "./_client";
import { DataEditModal, DataListContainer } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";
import { fetch } from "@decentverse/client";

export const Admin = ({ sliceName = "asset", init }: ModelsProps<fetch.Asset>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Asset.Unit.Admin}
      renderDashboard={Asset.Util.Stat}
      queryMap={fetch.assetQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(asset: DefaultOf<fetch.Asset>) => `${asset.name}`}>
          <Asset.Edit.General />
        </DataEditModal>
      }
      columns={["type", "status", "createdAt"]}
      actions={(asset: fetch.LightAsset, idx) => ["remove", "edit"]}
    />
  );
};
