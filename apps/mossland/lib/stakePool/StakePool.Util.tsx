"use client";
import * as StakePool from "./_client";
import { DataDashboard, SignWallet } from "@shared/client";
import { ModelDashboardProps } from "@util/client";
import { fetch, st } from "@mossland/client";
import { useState } from "react";

export const Selections = () => {
  const stakePoolSelection = st.use.stakePoolSelection();
  return (
    <>
      {stakePoolSelection.map((stakePool, idx) => (
        <StakePool.Unit.Admin
          className="bg-white"
          key={stakePool.id}
          stakePool={stakePool}
          actions={["edit", "remove"]}
        />
      ))}
    </>
  );
};

export const Stat = ({
  className,
  summary,
  sliceName = "stakePool",
  queryMap = fetch.stakePoolQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.StakePoolSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalStakePool"]}
      hidePresents={hidePresents}
    />
  );
};

interface AddStakeProps {
  stakePoolId: string;
}

export const AddStake = ({ stakePoolId }: AddStakeProps) => {
  const [agree, setAgree] = useState(false);
  const stakeHour = st.use.stakeHour();
  const stakeValue = st.use.stakeValue();
  const myKeyring = st.use.myKeyring();
  const self = st.use.self();
  const wallet = myKeyring.wallets[0];
  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-5">
        <input className="checkbox" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />위
        사항을 숙지하였으며, 동의합니다.
      </div>
      <div className="flex items-center justify-center px-4">
        {wallet && (
          <SignWallet
            className="w-full px-2"
            networkType={
              wallet.network.type === "ganache" || wallet.network.type === "offchain" ? "debugnet" : wallet.network.type
            }
            disabled={!wallet}
            walletType={wallet.network.provider === "ethereum" ? "metamask" : "kaikas"}
            onSigned={() => {
              st.do.addStaking(stakePoolId);
            }}
          >
            <button
              disabled={!agree || !stakeHour || !stakeValue}
              className="relative w-full border-2 border-black btn btn-primary"
            >
              예치하기
            </button>
          </SignWallet>
        )}
      </div>
    </div>
  );
};
