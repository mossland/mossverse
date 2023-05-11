import { gql, slice, st } from "@platform/data-access";
import { useLocale } from "@platform/data-access";
import { DataEditModal, Field } from "@shared/ui-web";
import { cnst, Utils } from "@shared/util";
import { DefaultOf, ModelEditProps } from "@shared/util-client";
import { DatePicker } from "antd";
// import { Button, Image, Input } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { ReactNode, useEffect } from "react";

interface ListingEditProps {
  slice: slice.ListingSlice;
}
export const ListingEdit = ({ slice }: ListingEditProps) => {
  const listingForm = slice.use.listingForm();
  const { l } = useLocale();
  return (
    <DataEditModal slice={slice} renderTitle={(listing: DefaultOf<gql.Listing>) => `${listing.id}`}>
      {/* <Type slice={slice} listing={listingForm} /> */} //! lisingForm이랑 listing이랑 다름.
      <Field.Tags label="Tags" values={listingForm.tags} onUpdate={slice.do.setTagsOnListing} />
      <Field.Number label="value" value={listingForm.value} onChange={slice.do.setValueOnListing} />
      <Field.DatePick
        label="closeAt"
        date={listingForm.closeAt}
        min={dayjs(new Date()).add(1, "day")}
        max={dayjs(new Date()).add(60, "day")}
        onChange={(closeAt) => {
          closeAt && slice.do.setCloseAtOnListing(closeAt);
        }}
        // showTime
      />
      {listingForm.priceTags.map((priceTag, index) => (
        <div className="font-bold text-black" key={index}>
          {`${l("listing.priceTags")}${index + 1})`}
          <Field.Number
            label="가격"
            value={priceTag.price}
            onChange={(price) => slice.do.writeOnListing(`priceTags.${index}.price`, price)}
          />
          <Field.Number
            label="할인가"
            value={priceTag.discountPrice}
            onChange={(discountPrice) => slice.do.writeOnListing(`priceTags.${index}.discountPrice`, discountPrice)}
          />
          <Field.SelectItem
            label="판매할 재화 타입"
            items={cnst.priceTagTypes}
            value={priceTag.type}
            onChange={(type) => slice.do.writeOnListing(`priceTags.${index}.type`, type)}
          />
          {priceTag.type === "thing" ? (
            <Field.Parent
              label="재화"
              slice={st.slice.thing}
              value={priceTag.thing as gql.shared.Thing}
              onChange={(thing) => slice.do.writeOnListing(`priceTags.${index}.thing`, thing)}
              renderOption={(thing) => `${thing.name}/${thing.id}/${thing.status}`}
            />
          ) : priceTag.type === "token" ? (
            <Field.Parent
              label="재화"
              slice={st.slice.token}
              value={priceTag.token as gql.shared.Token}
              onChange={(token) => slice.do.writeOnListing(`priceTags.${index}.token`, token)}
              renderOption={(token) => `${token.meta?.name}/${token.id}/${token.tokenId}`}
            />
          ) : (
            <></>
          )}
        </div>
      ))}
    </DataEditModal>
  );
};

interface ListingEditInSelfProps {
  slice: slice.ListingSlice;
  ownershipSlice?: slice.shared.OwnershipSlice;
  actions?: ReactNode;
}
export const ListingEditInSelf = ({ slice, ownershipSlice, actions }: ListingEditInSelfProps) => {
  const listingForm = slice.use.listingForm();
  const ownership = ownershipSlice?.use.ownership() ?? null;
  const { l } = useLocale();
  const src = listingForm.thing?.image?.url ?? listingForm?.token?.meta?.image ?? listingForm.product?.image?.url ?? "";
  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <Image alt="listingEdit" className="rounded-md shadow-md" width={324} height={324} src={src} />
      </div>
      <div className="m-5 mb-10">
        <div className="flex items-center">
          <div className="font-bold text-[22px]">수량</div>
          {ownership && ownership !== "loading" && (
            <div className="ml-3 text-red-500">*판매 가능한 수량 {ownership.value}</div>
          )}
        </div>
        <div className="mr-[400px] min-w-[400px]">
          <input
            type={"text"}
            className="py-1  w-full duration-300 text-[18px] border-black focus:border-blue-400 hover:border-blue-400"
            value={listingForm.value}
            onChange={(event) => {
              slice.do.setValueOnListing(Number(event.target.value));
            }}
          />
        </div>
        <div className="mt-4">
          <div className="font-bold text-[22px]">판매 가격</div>
          <div className="flex">
            <div className="flex mr-[400px] min-w-[400px] w-full py-1 items-center justify-center px-2 rounded-md border-[1px] duration-300 text-[18px] border-black focus:border-blue-400 hover:border-blue-400">
              <Image alt="?" width={20} height={20} src={listingForm?.priceTags[0]?.thing?.image?.url ?? ""} />
              <input
                className="w-full px-1 py-0 border-0"
                maxLength={20}
                value={listingForm.priceTags[0]?.price ?? ""}
                onChange={(price) => slice.do.writeOnListing(`priceTags.${0}.price`, Number(price.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      {actions}
    </div>
  );
};

ListingEdit.InSelf = ListingEditInSelf;
