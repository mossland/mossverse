"use client";
import * as Wallet from "./_client";
import { DataEditModal, DataListContainer, fetch } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";

export const Admin = ({ sliceName = "wallet", init }: ModelsProps<fetch.Wallet>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Wallet.Unit.Admin}
      renderDashboard={Wallet.Util.Stat}
      queryMap={fetch.walletQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(wallet: DefaultOf<fetch.Wallet>) => `${wallet.address}`}>
          <Wallet.Edit.General />
        </DataEditModal>
      }
      type="list"
      columns={["type", { key: "field", render: (field: string) => <span>{field}</span> }, "status", "createdAt"]}
      actions={(wallet: fetch.LightWallet, idx) => ["remove", "edit"]}
    />
  );
};
