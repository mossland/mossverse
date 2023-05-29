"use client";
import { redirect, useSearchParams } from "next/navigation";
import { st, usePage } from "@mossland/client";

export default function Page({ params: { stakePoolId } }) {
  const { path } = usePage();
  const self = st.use.self();
  const jwt = useSearchParams()?.get("jwt");
  if (!self.id && jwt) st.do.login({ auth: "user", jwt });
  if (stakePoolId) redirect(`/stakePool/${stakePoolId}/new`);
  // const { stakePoolList } = await fetch.initStakePool({ limit: 0 });
  // const stakePool = stakePoolList[0];
  // if (stakePool) redirect(`/stakePool/${stakePool.id}`);
  return <div className=""></div>;
}
