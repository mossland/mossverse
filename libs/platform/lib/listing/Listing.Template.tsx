"use client";
import { DataEditModal, Field, Image } from "@shared/client";
import { DefaultOf } from "@util/client";
import { ReactNode } from "react";
import { cnst } from "@util/client";
import { fetch, st, usePage } from "@platform/client";
import dayjs from "dayjs";

interface GeneralProps {
  sliceName?: string;
}
export const General = ({ sliceName = "listing" }: GeneralProps) => {
  const listingForm = st.use.listingForm();
  const { l } = usePage();
  return (
    <DataEditModal sliceName={sliceName} renderTitle={(listing: DefaultOf<fetch.Listing>) => `${listing.id}`}>
      {/* <Type sliceName={sliceName} listing={listingForm} /> */} //! lisingForm이랑 listing이랑 다름.
      <Field.Tags label="Tags" values={listingForm.tags} onUpdate={st.do.setTagsOnListing} />
      <Field.Number label="value" value={listingForm.value} onChange={st.do.setValueOnListing} />
      <Field.DatePick
        label="closeAt"
        date={listingForm.closeAt}
        min={dayjs(new Date()).add(1, "day")}
        max={dayjs(new Date()).add(60, "day")}
        onChange={(closeAt) => {
          closeAt && st.do.setCloseAtOnListing(closeAt);
        }}
        // showTime
      />
      {listingForm.priceTags.map((priceTag, index) => (
        <div className="font-bold text-black" key={index}>
          {`${l("listing.priceTags")}${index + 1})`}
          <Field.Number
            label="가격"
            value={priceTag.price}
            onChange={(price) => st.do.writeOnListing(`priceTags.${index}.price`, price)}
          />
          <Field.Number
            label="할인가"
            value={priceTag.discountPrice}
            onChange={(discountPrice) => st.do.writeOnListing(`priceTags.${index}.discountPrice`, discountPrice)}
          />
          <Field.SelectItem
            label="판매할 재화 타입"
            items={cnst.priceTagTypes}
            value={priceTag.type}
            onChange={(type) => st.do.writeOnListing(`priceTags.${index}.type`, type)}
          />
          {priceTag.type === "thing" ? (
            <Field.Parent
              label="재화"
              sliceName="thing"
              value={priceTag.thing as fetch.shared.Thing}
              onChange={(thing) => st.do.writeOnListing(`priceTags.${index}.thing`, thing)}
              renderOption={(thing: fetch.shared.Thing) => `${thing.name}/${thing.id}/${thing.status}`}
            />
          ) : priceTag.type === "token" ? (
            <Field.Parent
              label="재화"
              sliceName="token"
              value={priceTag.token as fetch.shared.Token}
              onChange={(token) => st.do.writeOnListing(`priceTags.${index}.token`, token)}
              renderOption={(token: fetch.shared.Token) => `${token.meta?.name}/${token.id}/${token.tokenId}`}
            />
          ) : (
            <></>
          )}
        </div>
      ))}
    </DataEditModal>
  );
};

interface InSelfProps {
  sliceName?: string;
  actions?: ReactNode;
}
export const InSelf = ({ sliceName = "listing", actions }: InSelfProps) => {
  const listingForm = st.use.listingForm();
  const ownership = st.use.ownership() ?? null;
  const { l } = usePage();
  const src = listingForm.thing?.image?.url ?? listingForm?.token?.meta?.image ?? listingForm.product?.image?.url ?? "";
  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <Image className="rounded-md shadow-md" width={324} height={324} src={src} />
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
              st.do.setValueOnListing(Number(event.target.value));
            }}
          />
        </div>
        <div className="mt-4">
          <div className="font-bold text-[22px]">판매 가격</div>
          <div className="flex">
            <div className="flex mr-[400px] min-w-[400px] w-full py-1 items-center justify-center px-2 rounded-md border-[1px] duration-300 text-[18px] border-black focus:border-blue-400 hover:border-blue-400">
              <Image width={20} height={20} src={listingForm?.priceTags[0]?.thing?.image?.url ?? ""} />
              <input
                className="w-full px-1 py-0 border-0"
                maxLength={20}
                value={listingForm.priceTags[0]?.price ?? ""}
                onChange={(price) => st.do.writeOnListing(`priceTags.${0}.price`, Number(price.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      {actions}
    </div>
  );
};
