"use client";
import { st } from "@mossland/client";
import { useEffect } from "react";

export default function Page({ children }) {
  const self = st.use.self();
  const marketSubMenu = st.use.marketSubMenu();
  const queryOfListing = st.use.queryOfListing();
  useEffect(() => {
    const query =
      marketSubMenu === "all"
        ? { status: "active", ...(self ? { user: { $ne: self.id } } : {}) }
        : marketSubMenu === "gifticon"
        ? { status: "active", type: "gifticon", ...(self ? { user: { $ne: self.id } } : {}) }
        : marketSubMenu === "mossmarket"
        ? { status: "active", ...(self ? { user: { $ne: self.id } } : {}) }
        : marketSubMenu === "cyberthug"
        ? { status: "active", tags: { $in: ["cyberthug"] }, ...(self ? { user: { $ne: self.id } } : {}) }
        : marketSubMenu === "p2p"
        ? { status: "active", ...(self ? { user: { $ne: self.id } } : {}) }
        : marketSubMenu === "skinp2p"
        ? { status: "active", type: "skin", ...(self ? { user: { $ne: self.id } } : {}) }
        : queryOfListing;
    st.do.setQueryOfListing(query);
  }, [marketSubMenu, self]);
  return <div className="w-full h-full ">{children}</div>;
}
