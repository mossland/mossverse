"use client";

import { st } from "@mossland/client";

export default function Page({ children }) {
  st.use.self();
  return (
    <div className={"absolute top-0 overflow-y-auto left-0 z-10 w-screen h-screen overflow-hidden dom"}>{children}</div>
  );
}
