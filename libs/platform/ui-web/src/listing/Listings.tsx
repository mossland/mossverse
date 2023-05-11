import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { gql, st, slice } from "@platform/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img, ProuctEditInChild } from "@shared/ui-web";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import { ScheduleOutlined } from "@ant-design/icons";
import { cnst, Utils } from "@shared/util";
import dayjs from "dayjs";

export const ListingMenuItem: DataMenuItem = {
  key: "listing",
  label: "Listing",
  icon: <ScheduleOutlined />,
  render: () => <Listings />,
};

export const Listings = ({ slice = st.slice.listing, init }: ModelsProps<slice.ListingSlice, gql.Listing>) => {
  return (
    <DataListContainer
      slice={slice}
      init={{
        ...init,
      }}
      filterOptions={[
        { key: "skin", query: { type: "skin" } },
        { key: "gifticon", query: { type: "gifticon" } },
      ]}
      sortOptions={
        [
          // { key: "스킨", sort: { type: "skin" } },
        ]
      }
      edit={<ListingEdit slice={slice} />}
      renderItem={Listing}
      columns={["user", "product", "tags", "closeAt"]}
      actions={["edit"]}
      title={"Listings"}
    />
  );
};
export const Listing = ({
  listing,
  slice = st.slice.listing,
  actions,
  columns,
}: ModelProps<slice.ListingSlice, gql.Listing>) => {
  return (
    <DataItem
      cover={<img src={listing.getImageUrl()} width={500} height={350} alt="listing" />}
      title={listing.id}
      model={listing}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};
interface ListingEditProps {
  slice: slice.ListingSlice;
}
export const ListingEdit = ({ slice }: ModelEditProps<slice.ListingSlice>) => {
  const listingForm = slice.use.listingForm();
  return (
    <DataEditModal slice={slice} renderTitle={(listing: DefaultOf<gql.Listing>) => `${listing.id}`}>
      {/* {isNewProcduct ? (
        <ProuctEditInChild slice={st.slice.product} />
      ) : (
        <> */}
      {/* <Field.Parent
        init={{ query: { status: "active", roles: { $in: "admin" } } }}
        label="listing.user"
        slice={st.slice.user}
        value={listingForm.user as gql.shared.User}
        onChange={(user) => slice.do.setUserOnListing(user as gql.shared.User)}
        renderOption={(user) => `${user.nickname}/${user.id}/${user.status}/${user.roles}`}
      /> */}
      <Field.Parent
        label="listing.product"
        slice={st.slice.product}
        value={listingForm.product as gql.shared.Product}
        onChange={(product) => slice.do.setProductOnListing(product as gql.shared.Product)}
        renderOption={(product) => `${product.name}/${product.id}/${product.status}`}
      />

      <Field.Tags label="Tags" values={listingForm.tags} onUpdate={slice.do.setTagsOnListing} />
      <Field.Number label="value" value={listingForm.value} onChange={slice.do.setValueOnListing} />
      <Field.DatePick
        label="closeAt"
        date={listingForm.closeAt}
        min={dayjs().add(1, "day")}
        max={dayjs().add(2, "month")}
        onChange={(closeAt) => {
          closeAt && slice.do.setCloseAtOnListing(closeAt);
        }}
        // showTime
      />
      {listingForm.priceTags.map((priceTag, index) => (
        <div key={index}>
          {`priceTag${index + 1}`}
          <Field.Number
            label="price"
            value={priceTag.price}
            onChange={(price) => {
              slice.do.writeOnListing(`priceTags.${index}.price`, price);
              // slice.do.setPriceTagsOnListing(
              //   listingForm.priceTags.map((priceTag, i) => {
              //     if (i === index) {
              //       return { ...priceTag, price };
              //     }
              //     return priceTag;
              //   })
              // );
            }}
          />
          <Field.Number
            label="discountPrice"
            value={priceTag.discountPrice}
            onChange={(discountPrice) => {
              slice.do.writeOnListing(`priceTags.${index}.discountPrice`, discountPrice);
            }}
          />
          <Field.SelectItem
            label="type"
            items={cnst.priceTagTypes}
            value={priceTag.type}
            onChange={(type) => {
              slice.do.writeOnListing(`priceTags.${index}.type`, type);
            }}
          />
          {priceTag.type === "thing" ? (
            <Field.Parent
              label="thing"
              slice={st.slice.thing}
              value={priceTag.thing as gql.shared.Thing}
              onChange={(thing) => {
                slice.do.writeOnListing(`priceTags.${index}.thing`, thing);
              }}
              renderOption={(thing) => `${thing.name}/${thing.id}/${thing.status}`}
            />
          ) : priceTag.type === "token" ? (
            <Field.Parent
              label="token"
              slice={st.slice.token}
              value={priceTag.token as gql.shared.Token}
              onChange={(token) => {
                slice.do.writeOnListing(`priceTags.${index}.token`, token);
              }}
              renderOption={(token) => `${token.meta?.name}/${token.id}/${token.tokenId}`}
            />
          ) : (
            <></>
          )}
        </div>
      ))}

      <button
        onClick={() => {
          slice.do.setPriceTagsOnListing([...listingForm.priceTags, {} as gql.PriceTag]);
        }}
      >
        + new Price Tag
      </button>
    </DataEditModal>
  );
};
