import React, { useEffect } from "react";
import { MarketHeader, MenuBar } from "@mossland/frontend/components";
import { gql, st, slice } from "@mossland/frontend/stores";
import { env } from "../../env/env";
import { Raffle, Listing } from "@platform/ui-web";
import Router from "next/router";
import { LoadItems } from "@shared/ui-web";
import { SkeletonList } from "libs/shared/ui-web/src/Loading";

export default function Page() {
  const self = st.use.self();
  const menu = Router.query.menu as "goods" | "nfts";
  const queryOfListing = st.use.queryOfListing();
  const subMenu = Router.query.subMenu as
    | "all"
    | "gifticon"
    | "skinp2p"
    | "raffle"
    | "mossmarket"
    | "p2p"
    | "cyberthug";

  useEffect(() => {
    subMenu === "all"
      ? st.do.initListing({
          query: { status: "active", ...(self.id?.length ? { user: { $ne: self.id } } : {}) },
          invalidate: true,
        })
      : subMenu === "gifticon"
      ? st.do.initListing({
          query: { status: "active", type: "gifticon", ...(self.id?.length ? { user: { $ne: self.id } } : {}) },
          invalidate: true,
        })
      : subMenu === "mossmarket"
      ? st.do.initListing({
          query: { status: "active", ...(self.id?.length ? { user: { $ne: self.id } } : {}) },
          invalidate: true,
        })
      : subMenu === "cyberthug"
      ? st.do.initListing({
          query: {
            status: "active",
            tags: { $in: ["cyberthug"] },
            ...(self.id?.length ? { user: { $ne: self.id } } : {}),
          },
          invalidate: true,
        })
      : st.do.initListing({
          query: { status: "active", ...(self.id?.length ? { user: { $ne: self.id } } : {}) },
          invalidate: true,
        });
  }, [self, menu, subMenu]);

  return (
    <div className="overflow-scroll">
      <MarketHeader />
      <MenuBar />
      <LoadItems
        className="grid grid-cols-2 md:grid-cols-4"
        slice={st.slice.listing}
        init={{
          query: queryOfListing,
        }}
        loading={<SkeletonList num={6} width={324} height={324} className="rounded-xl" />}
        renderItem={(listing: gql.platform.LightListing, index: number) => (
          <Listing.Item.InMarket
            onClick={() => Router.push(`/listing/${listing.id}`)}
            self={self}
            slice={st.slice.listing}
            listing={listing}
          />
        )}
        renderEmpty={() => (
          <div className="flex items-center justify-center w-full h-full">
            <div>No Listings</div>
          </div>
        )}
      />
    </div>
  );
}
