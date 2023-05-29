"use client";
import * as Network from "./_client";
import { DataEditModal, DataListContainer, fetch, st } from "@shared/client";
import { DefaultOf, InitActionForm, ModelsProps } from "@util/client";
import { ReactNode, useEffect } from "react";
import { cnst } from "@util/client";

export const Admin = ({ sliceName = "network", init }: ModelsProps<fetch.Network>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Network.Unit.Admin}
      renderDashboard={Network.Util.Stat}
      queryMap={fetch.networkQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(network: DefaultOf<fetch.Network>) => `${network.name}`}>
          <Network.Edit.General />
        </DataEditModal>
      }
      type="list"
      columns={["name", "networkId", "provider", "type"]}
      actions={["edit"]}
    />
  );
};

type NetworkZoneSelectProps = {
  init?: InitActionForm<fetch.Network>;
  loading?: ReactNode;
} & {
  [key in cnst.NetworkProvider as `render${Capitalize<key>}`]?: (network: fetch.LightNetwork) => ReactNode;
};
export const Select = ({
  init,
  loading,
  renderEthereum = () => <></>,
  renderKlaytn = () => <></>,
}: NetworkZoneSelectProps) => {
  const networkList = st.use.networkMap();
  useEffect(() => {
    st.do.initNetwork(init);
  }, []);
  if (networkList === "loading") return <div>{loading ?? "Loading..."}</div>;
  return (
    <div className="flex justify-center my-4">
      {[...networkList.values()].map((network) => (
        <div key={network.id}>
          {network.provider === "ethereum" ? (
            renderEthereum(network)
          ) : network.provider === "klaytn" ? (
            renderKlaytn(network)
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};
