"use client";

import { redirect, useSearchParams } from "next/navigation";
import { st, usePage } from "@mossland/client";

export default function Page({ params: { stakePoolId } }) {
  const { path } = usePage();
  const self = st.use.self();
  const jwt = useSearchParams()?.get("jwt");
  if (!self.id && jwt) st.do.login({ auth: "user", jwt });
  redirect(`/stakePool/${stakePoolId}/new`);
}
