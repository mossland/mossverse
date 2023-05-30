"use client";
import { st } from "@mossland/client";

export default function Page({ children }) {
  const self = st.use.self();
  return <div className="relative h-full">{children}</div>;
}
