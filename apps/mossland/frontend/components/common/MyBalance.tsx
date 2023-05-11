import React, { useEffect, useState } from "react";
import { MyBalanceInfo } from "@platform/ui-web";
import { gql, st, store } from "../../stores";
import { Utils } from "@shared/util";

type MyBalanceProps = {
  isHideMoc?: boolean;
  isHideMmoc?: boolean;
};

export const MyBalance = (props: MyBalanceProps) => {
  //!need to change
  const self = st.use.self();
  const ownershipList = st.use.ownershipListInMoney();
  const [MMOC, setMMOC] = useState<gql.shared.LightOwnership>();
  useEffect(() => {
    if (!self?.keyring) return;
    // st.set({ wallet: self.keyring.wallets[0] });
  }, [self?.keyring]);

  useEffect(() => {
    if (ownershipList === "loading") return;
    const mmoc = ownershipList.find((item) => item.thing && item.thing.name === "MMOC");
    mmoc && setMMOC(mmoc);
  }, [ownershipList]);

  const itemClassName = "flex items-center justify-between";
  const labelClassName = "font-bold text-[22px] text-[#555]";
  const imageClassName = "inline-block mt-[-2px] w-[16px] mr-[4px]";

  return (
    <div className="w-full md:mt-[6px]">
      {MMOC ? (
        <div className={itemClassName}>
          <div className={labelClassName}>
            <img className={imageClassName} src={MMOC?.thing?.image.url} />
            {MMOC?.thing?.name ?? "MMOC"}
          </div>
          <div className="text-[22px]">{MMOC.value ? Utils.numberWithCommas(MMOC.value) : 0}</div>
        </div>
      ) : (
        <div className={itemClassName}>
          <div className={labelClassName}>
            <img className={imageClassName} src="/images/mm_coin.png" />
            {"MMOC"}
          </div>
          <div className="text-[22px]">{0}</div>
        </div>
      )}

      {/* {wallet ? (
        <div className="flex-item">
          <MyProfile nickname={self?.nickname || ""} />
        </div>
      ) : (
        <Connect />
      )} */}
    </div>
  );
};
