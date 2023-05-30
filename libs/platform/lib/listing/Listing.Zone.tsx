"use client";
import * as Listing from "./_client";
import { DataListContainer, Image, LoadUnits, LoadView, Ownership } from "@shared/client";
import { ModelsProps, ServerInit, ServerView } from "@util/client";
import { fetch, st } from "@platform/client";
import dayjs from "dayjs";

export const Admin = ({ sliceName = "listing", init }: ModelsProps<fetch.Listing>) => {
  return (
    <DataListContainer
      sliceName={sliceName}
      init={{ ...init, default: { priceTags: [{}] } as any }}
      renderItem={Listing.Unit.Admin}
      filterOptions={[
        { key: "skin", query: { type: "skin" } },
        { key: "gifticon", query: { type: "gifticon" } },
      ]}
      edit={<Listing.Edit.General />}
      columns={[
        {
          key: "user",
          render: (user) => {
            return (
              <div className="w-full">
                name: {user?.nickname}
                <br />
                role: {user?.roles}
              </div>
            );
          },
        },
        {
          key: "product",
          render: (product: fetch.shared.Product) => {
            return product && <Image className="w-[40px] h-[40px]" file={product.image} />;
          },
        },
        {
          key: "thing",
          render: (thing: fetch.shared.Thing) => thing && <Image className="w-[40px] h-[40px]" file={thing.image} />,
        },
        {
          key: "token",
          render: (token: fetch.shared.Token) => token && <Image className="w-[40px] h-[40px]" file={token.image} />,
        },

        "tags",
        {
          key: "closeAt",
          render: (closeAt: Date) => (
            <div>{closeAt ? dayjs(closeAt).format("YYYY-MM-DD a hh:mm:ss까지") : "제한없음"}</div>
          ),
        },
      ]}
      actions={["edit"]}
      title={"Listings"}
    />
  );
};
interface MarketProps {
  className?: string;
  init: ServerInit<"listing", fetch.LightListing>;
}
export const Market = ({ className, init }: MarketProps) => {
  return (
    <LoadUnits
      className={className}
      init={init}
      renderItem={(listing) => (
        <button className="w-full" onClick={() => st.do.viewListing(listing.id, { modal: `view-${listing.id}` })}>
          <Listing.Unit.Market listing={listing} />
        </button>
      )}
      renderEmpty={() => (
        <div className="flex items-center justify-center w-full h-full min-h-[400px]">
          <div>No Listings</div>
        </div>
      )}
    />
  );
};

interface MarketViewProps {
  className?: string;
  view: ServerView<"listing", fetch.Listing>;
  money?: string;
}
export const MarketView = ({ className, view, money }: MarketViewProps) => {
  return (
    <LoadView
      className={className}
      view={view}
      renderView={(listing) => <Listing.View.Market listing={listing} money={money} />}
    />
  );
};
interface MarketViewModalProps {
  className?: string;
  money?: string;
}
export const MarketViewModal = ({ className, money }: MarketViewModalProps) => {
  const listingModal = st.use.listingModal();
  const listing = st.use.listing();
  if (listing === "loading") return <></>;
  return (
    <div>
      <Listing.View.Market listing={listing} money={money} />
      <div className="mx-2">
        <Listing.Util.Buy price={listing.value} money="MMOC" />
      </div>
    </div>
  );
};

interface SelfProps {
  className?: string;
  init: ServerInit<"listing", fetch.LightListing>;
}
export const Self = ({ className, init }: SelfProps) => {
  return (
    <LoadUnits
      className={className}
      init={init}
      renderItem={(listing) => <Listing.Unit.Self href={`myToken/listing/${listing.id}`} listing={listing} />}
      renderEmpty={() => (
        <div className="flex items-center justify-center w-full h-full min-h-[400px]">
          <div>No Listings</div>
        </div>
      )}
    />
  );
};
interface SelfViewProps {
  className?: string;
  view: ServerView<"listing", fetch.Listing>;
}
export const SelfView = ({ className, view }: SelfViewProps) => {
  return (
    <LoadView className={className} view={view} renderView={(listing) => <Listing.View.Self listing={listing} />} />
  );
};

interface MyOwnershipsProps {
  className?: string;
  init: ServerInit<"ownership", fetch.shared.LightOwnership>;
}
export const MyOwnerships = ({ className, init }: MyOwnershipsProps) => {
  return (
    <LoadUnits
      className={className}
      init={init}
      renderItem={(ownership) => (
        <Ownership.Unit.InSelf ownership={ownership} href={`/self/ownership/${ownership.id}`} />
      )}
      renderEmpty={() => (
        <div className="flex items-center justify-center w-full h-full min-h-[400px]">
          <div>No Your Ownerships.</div>
        </div>
      )}
    />
  );
};
