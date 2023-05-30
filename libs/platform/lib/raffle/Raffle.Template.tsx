"use client";
import { Field } from "@shared/client";
import { cnst } from "@util/client";
import { fetch, st, usePage } from "@platform/client";
import dayjs from "dayjs";

// interface GeneralProps {

// }

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = () => {
  const { l } = usePage();
  const raffleForm = st.use.raffleForm();
  return (
    <div>
      <Field.SelectItem
        label={l("raffle.type")}
        items={cnst.raffleTypes}
        value={raffleForm.type}
        onChange={st.do.setTypeOnRaffle}
      />
      {raffleForm.type === "thing" ? (
        <Field.Parent
          label={l("raffle.thing")}
          sliceName="thing"
          value={raffleForm.thing as fetch.shared.Thing}
          onChange={(thing: fetch.shared.LightThing) => st.do.setThingOnRaffle(thing as fetch.shared.Thing)}
          renderOption={(thing: fetch.shared.LightThing) => `${thing.name}/${thing.id}/${thing.status}`}
        />
      ) : raffleForm.type === "token" ? (
        <Field.Parent
          label={l("raffle.token")}
          sliceName="token"
          value={raffleForm.token as fetch.shared.Token}
          onChange={(token: fetch.shared.LightToken) => st.do.setTokenOnRaffle(token as fetch.shared.Token)}
          renderOption={(token: fetch.shared.LightToken) => `${token.meta?.name}/${token.id}/${token.tokenId}`}
        />
      ) : raffleForm.type === "product" ? (
        <Field.Parent
          label={l("raffle.product")}
          sliceName="product"
          value={raffleForm.product as fetch.shared.Product}
          onChange={(product: fetch.shared.LightProduct) => st.do.setProductOnRaffle(product as fetch.shared.Product)}
          renderOption={(product: fetch.shared.LightProduct) => `${product.name}/${product.id}/${product.status}`}
        />
      ) : (
        <></>
      )}
      <Field.Number
        label={l("raffle.entryLimit")}
        value={raffleForm.entryLimit}
        onChange={st.do.setEntryLimitOnRaffle}
      />
      <Field.Tags label={l("raffle.tags")} values={raffleForm.tags} onUpdate={st.do.setTagsOnRaffle} />
      <Field.DatePick
        label={l("raffle.closeAt")}
        date={raffleForm.closeAt}
        min={dayjs(new Date()).add(1, "day")}
        max={dayjs(new Date()).add(2, "month")}
        onChange={(closeAt) => {
          closeAt && st.do.setCloseAtOnRaffle(closeAt);
          closeAt && st.do.setAnnounceAtOnRaffle(closeAt.add(1, "day"));
        }}
        showTime
      />
      <Field.DatePick
        label={l("raffle.announceAt")}
        date={raffleForm.announceAt}
        min={raffleForm.closeAt.add(1, "month")}
        max={raffleForm.closeAt.add(2, "month")}
        onChange={(announceAt) => {
          announceAt && st.do.setAnnounceAtOnRaffle(announceAt);
        }}
        showTime
      />
      {raffleForm.priceTags.map((priceTag, index) => (
        <div className="font-bold text-black" key={index}>
          {`${l("raffle.priceTags")}${index + 1})`}
          <Field.Number
            label="가격"
            value={priceTag.price}
            onChange={(price) => st.do.writeOnRaffle(`priceTags.${index}.price`, price)}
          />
          <Field.Number
            label="할인가"
            value={priceTag.discountPrice}
            onChange={(discountPrice) => st.do.writeOnRaffle(`priceTags.${index}.discountPrice`, discountPrice)}
          />
          <Field.SelectItem
            label="판매할 재화 타입"
            items={cnst.priceTagTypes}
            value={priceTag.type}
            onChange={(type) => st.do.writeOnRaffle(`priceTags.${index}.type`, type)}
          />
          {priceTag.type === "thing" ? (
            <Field.Parent
              label="재화"
              sliceName="thing"
              value={priceTag.thing as fetch.shared.Thing}
              onChange={(thing: fetch.shared.LightThing) => st.do.writeOnRaffle(`priceTags.${index}.thing`, thing)}
              renderOption={(thing: fetch.shared.LightThing) => `${thing.name}/${thing.id}/${thing.status}`}
            />
          ) : priceTag.type === "token" ? (
            <Field.Parent
              label="재화"
              sliceName="token"
              value={priceTag.token as fetch.shared.Token}
              onChange={(token: fetch.shared.LightToken) => st.do.writeOnRaffle(`priceTags.${index}.token`, token)}
              renderOption={(token: fetch.shared.LightToken) => `${token.meta?.name}/${token.id}/${token.tokenId}`}
            />
          ) : (
            <></>
          )}
        </div>
      ))}
      {/* 
      <button
        onClick={() => {
          st.do.setPriceTagsOnRaffle([...raffleForm.priceTags, {} as fetch.PriceTag]);
        }}
      >
        + new Price Tag
      </button> */}
    </div>
  );
};
