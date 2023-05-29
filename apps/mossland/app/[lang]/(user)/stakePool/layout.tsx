"use client";

import { st } from "@mossland/client";

export default function Layout({ children }) {
  st.use.self();
  return <div className="relative">{children}</div>;
}
