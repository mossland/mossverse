"use client";
import * as Keyring from "./_client";
import { DataListContainer, fetch, st } from "@shared/client";
import { ModelsProps } from "@util/client";

export const Admin = ({ sliceName = "keyring", init }: ModelsProps<fetch.Keyring>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Keyring.Unit.Admin}
      renderDashboard={Keyring.Util.Stat}
      queryMap={fetch.keyringQueryMap}
      type="list"
      columns={["id", "name", "accountId", "phone", "verifies"]}
      actions={["remove"]}
    />
  );
};
interface MyCryptoProps {
  className?: string;
  walletPolicy?: "single" | "multple";
}
export const MyCrypto = ({ className, walletPolicy }: MyCryptoProps) => {
  const myKeyring = st.use.myKeyring();
  return <Keyring.View.Crypto keyring={myKeyring} className={className} walletPolicy={walletPolicy} />;
};
