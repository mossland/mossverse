import { Input } from "antd";
import { gql, st, slice, useLocale } from "@platform/data-access";
import { DataEditModal, Editor, OnlyAdmin } from "@shared/ui-web";
import { Field } from "@shared/ui-web";
import { useEffect } from "react";
import { cnst } from "@shared/util";
import dayjs from "dayjs";

interface RaffleEditProps {
  slice?: slice.RaffleSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const RaffleEdit = ({ slice = st.slice.raffle }: RaffleEditProps) => {
  const { l } = useLocale();
  const raffleForm = slice.use.raffleForm();
  return (
    <div>
      <Field.SelectItem
        label={l("raffle.type")}
        items={cnst.raffleTypes}
        value={raffleForm.type}
        onChange={slice.do.setTypeOnRaffle}
      />
      {raffleForm.type === "thing" ? (
        <Field.Parent
          label={l("raffle.thing")}
          slice={st.slice.thing}
          value={raffleForm.thing as gql.shared.Thing}
          onChange={(thing) => slice.do.setThingOnRaffle(thing as gql.shared.Thing)}
          renderOption={(thing) => `${thing.name}/${thing.id}/${thing.status}`}
        />
      ) : raffleForm.type === "token" ? (
        <Field.Parent
          label={l("raffle.token")}
          slice={st.slice.token}
          value={raffleForm.token as gql.shared.Token}
          onChange={(token) => slice.do.setTokenOnRaffle(token as gql.shared.Token)}
          renderOption={(token) => `${token.meta?.name}/${token.id}/${token.tokenId}`}
        />
      ) : raffleForm.type === "product" ? (
        <Field.Parent
          label={l("raffle.product")}
          slice={st.slice.product}
          value={raffleForm.product as gql.shared.Product}
          onChange={(product) => slice.do.setProductOnRaffle(product as gql.shared.Product)}
          renderOption={(product) => `${product.name}/${product.id}/${product.status}`}
        />
      ) : (
        <></>
      )}
      <Field.Number
        label={l("raffle.entryLimit")}
        value={raffleForm.entryLimit}
        onChange={slice.do.setEntryLimitOnRaffle}
      />
      <Field.Tags label={l("raffle.tags")} values={raffleForm.tags} onUpdate={slice.do.setTagsOnRaffle} />
      <Field.DatePick
        label={l("raffle.closeAt")}
        date={raffleForm.closeAt}
        min={dayjs(new Date()).add(1, "day")}
        max={dayjs(new Date()).add(2, "month")}
        onChange={(closeAt) => {
          closeAt && slice.do.setCloseAtOnRaffle(closeAt);
          closeAt && slice.do.setAnnounceAtOnRaffle(closeAt.add(1, "day"));
        }}
        showTime
      />
      <Field.DatePick
        label={l("raffle.announceAt")}
        date={raffleForm.announceAt}
        min={raffleForm.closeAt.add(1, "month")}
        max={raffleForm.closeAt.add(2, "month")}
        onChange={(announceAt) => {
          announceAt && slice.do.setAnnounceAtOnRaffle(announceAt);
        }}
        showTime
      />
      {raffleForm.priceTags.map((priceTag, index) => (
        <div className="font-bold text-black" key={index}>
          {`${l("raffle.priceTags")}${index + 1})`}
          <Field.Number
            label="가격"
            value={priceTag.price}
            onChange={(price) => slice.do.writeOnRaffle(`priceTags.${index}.price`, price)}
          />
          <Field.Number
            label="할인가"
            value={priceTag.discountPrice}
            onChange={(discountPrice) => slice.do.writeOnRaffle(`priceTags.${index}.discountPrice`, discountPrice)}
          />
          <Field.SelectItem
            label="판매할 재화 타입"
            items={cnst.priceTagTypes}
            value={priceTag.type}
            onChange={(type) => slice.do.writeOnRaffle(`priceTags.${index}.type`, type)}
          />
          {priceTag.type === "thing" ? (
            <Field.Parent
              label="재화"
              slice={st.slice.thing}
              value={priceTag.thing as gql.shared.Thing}
              onChange={(thing) => slice.do.writeOnRaffle(`priceTags.${index}.thing`, thing)}
              renderOption={(thing) => `${thing.name}/${thing.id}/${thing.status}`}
            />
          ) : priceTag.type === "token" ? (
            <Field.Parent
              label="재화"
              slice={st.slice.token}
              value={priceTag.token as gql.shared.Token}
              onChange={(token) => slice.do.writeOnRaffle(`priceTags.${index}.token`, token)}
              renderOption={(token) => `${token.meta?.name}/${token.id}/${token.tokenId}`}
            />
          ) : (
            <></>
          )}
        </div>
      ))}
      {/* 
      <button
        onClick={() => {
          slice.do.setPriceTagsOnRaffle([...raffleForm.priceTags, {} as gql.PriceTag]);
        }}
      >
        + new Price Tag
      </button> */}
    </div>
  );
};
