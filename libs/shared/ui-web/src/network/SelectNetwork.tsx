import { ReactNode, useEffect } from "react";
import { st, gql, slice } from "@shared/data-access";
import { cnst, Utils } from "@shared/util";
import { InitActionForm } from "@shared/util-client";

type NetworksProps = {
  slice?: slice.NetworkSlice;
  init?: InitActionForm<gql.Network>;
  loading?: ReactNode;
} & {
  [key in cnst.NetworkProvider as `render${Capitalize<key>}`]?: (network: gql.LightNetwork) => ReactNode;
};
export const SelectNetwork = ({
  slice = st.slice.network,
  init,
  loading,
  renderEthereum = () => <></>,
  renderKlaytn = () => <></>,
}: NetworksProps) => {
  const networkList = slice.use.networkList();
  useEffect(() => {
    slice.do.initNetwork(init);
  }, []);
  if (networkList === "loading") return <div>{loading ?? "Loading..."}</div>;
  return (
    <div className="flex justify-center my-4">
      {networkList.map((network) => (
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
