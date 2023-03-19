import { gql, st, slice } from "@platform/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img, ProuctEditInChild } from "@shared/ui-web";
import { ModelsProps } from "@shared/util-client";
import dayjs from "dayjs";
import { Item, Edit } from "./";

export const ListingList = ({ slice = st.slice.listing, init }: ModelsProps<slice.ListingSlice, gql.Listing>) => {
  // console.log(st.use.me());
  return (
    <DataListContainer
      slice={slice}
      init={{
        ...init,
        default: {
          priceTags: [{}],
        } as any,
      }}
      renderItem={Item}
      filterOptions={[
        { key: "skin", query: { type: "skin" } },
        { key: "gifticon", query: { type: "gifticon" } },
      ]}
      edit={<Edit slice={slice} />}
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
          render: (product: gql.shared.Product) => {
            return product && <img className="w-[40px] h-[40px]" src={product?.image.url ?? ""}></img>;
          },
        },
        {
          key: "thing",
          render: (thing: gql.shared.Thing) =>
            thing && <img className="w-[40px] h-[40px]" src={thing?.image?.url ?? ""}></img>,
        },
        {
          key: "token",
          render: (token: gql.shared.Token) =>
            token && <img className="w-[40px] h-[40px]" src={token?.image?.url ?? ""}></img>,
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
