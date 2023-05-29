// "use client";

import { StakePool, fetch } from "@mossland/client";

export default async function Page({ params: { stakePoolId } }) {
  const { stakePool, stakePoolView } = await fetch.viewStakePool(stakePoolId);

  return <StakePool.View.MyStaking stakePool={stakePool} />;
}
