"use client";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { Field, Select } from "@shared/client";
import { cnst } from "@util/client";
import { fetch, st, usePage } from "@platform/client";
import { useEffect, useState } from "react";

interface GeneralProps {
  tradeId?: string | null;
  sliceName?: string;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ sliceName = "trade", tradeId = undefined }: GeneralProps) => {
  const tradeForm = st.use.tradeForm();
  const { l } = usePage();
  return (
    <>
      <Field.Text label="Name" value={tradeForm.name} onChange={st.do.setNameOnTrade} />
      {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => st.setState({ type })}>
          {cnst.tradeTypes.map((type) => (
            <Select.Option value={type}>{type}</Select.Option>
          ))}
        </Select> */}
      <Field.SelectItem
        label="Policy"
        items={cnst.tradePolicies}
        value={tradeForm.policy}
        onChange={st.do.setPolicyOnTrade}
        mode="multiple"
      />
      <ExchangeEdit label="Input" exchanges={tradeForm.inputs} onChange={st.do.setInputsOnTrade} />
      <ExchangeEdit label="Output" exchanges={tradeForm.outputs} onChange={st.do.setOutputsOnTrade} />
    </>
  );
};

interface InputProps {
  sliceName?: string;
  input: fetch.Exchange;
  idx: number;
}

export const Input = ({ sliceName = "trade", input, idx }: InputProps) => {
  // const tradeForm = st.use.tradeForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      <p className="w-20 mt-3">가격</p>
      <input
        className="input input-bordered"
        value={input.value}
        onChange={(e) => st.do.writeOnTrade(`input.${idx}.value`, Number(e.target.value))}
      />
    </div>
  );
};
interface OutputProps {
  sliceName?: string;
  // output: fetch.ExchangeInput;
  idx: number;
}

export const Output = ({ sliceName = "trade", idx }: OutputProps) => {
  const tradeForm = st.use.tradeForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      <p className="w-20 mt-3">가격</p>
      <input
        type="number"
        value={tradeForm.outputs[idx]?.value ?? 0}
        onChange={(e) => {
          const value = Number(e.target.value);
          st.do.writeOnTrade(`outputs.${idx}.value`, value);
        }}
      />
    </div>
  );
};
// export const TradeEditInOutput = ({ sliceName = "trade", tradeId = undefined }: TradeEditProps) => {
//   const tradeForm = st.use.tradeForm();
//   const { l } = usePage();
//   return (
//     <>
//       <div className="flex items-center mb-4">
//         <p className="w-20 mt-3">{l("trade.field")}</p>
//         <Input value={tradeForm.} onChange={(e) => st.do.setFieldOnTrade(e.target.value)} />
//       </div>
//     </>
//   );
// };

interface ExchangeEditProps {
  label: string;
  exchanges: fetch.Exchange[];
  onChange: (exchanges: fetch.Exchange[]) => void;
}
export const ExchangeEdit = ({ label, exchanges, onChange }: ExchangeEditProps) => {
  const [type, setType] = useState<cnst.ExchangeType>("currency");
  const [value, setValue] = useState<number>(0);
  const [originalValue, setOriginalValue] = useState<number>(0);
  const [thing, setThing] = useState<fetch.shared.LightThing | null>(null);
  const [currency, setCurrency] = useState<fetch.shared.LightCurrency | null>(null);

  //! temp code
  const currencyMap = st.use.currencyMap();
  const thingMap = st.use.thingMap();
  const currencyList = currencyMap !== "loading" ? [...currencyMap.values()] : [];
  const thingList = thingMap !== "loading" ? [...thingMap.values()] : [];
  useEffect(() => {
    if (type === "currency") st.do.initCurrency();
    if (type === "thing") st.do.initThing();
  }, [type]);

  return (
    <>
      <div className="inline-block">
        <div className="flex gap-2">
          <label>{label}</label>
          <Select value={type} style={{ width: "100%" }} onChange={setType}>
            {cnst.exchangeTypes.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
          {type === "currency" && (
            <Select
              style={{ width: 100 }}
              value={currency?.id}
              onChange={(id) => setCurrency(currencyList.find((currency) => currency.id === id) ?? null)}
            >
              {currencyList.map((currency) => (
                <Select.Option key={currency.id} value={currency.id}>
                  {currency.name}
                </Select.Option>
              ))}
            </Select>
          )}
          {type === "thing" && (
            <Select
              style={{ width: 100 }}
              value={thing?.id}
              onChange={(id) => setThing(thingList.find((thing) => thing.id === id) ?? null)}
            >
              {thingList.map((thing) => (
                <Select.Option key={thing.id} value={thing.id}>
                  {thing.name}
                </Select.Option>
              ))}
            </Select>
          )}
          <Field.Number label="Value" value={value} onChange={setValue} />
          <Field.Number label="OriginalValue" value={originalValue} onChange={setOriginalValue} />
          <button
            className="btn"
            onClick={() => {
              if (value === 0 || (type === "thing" && !thing) || (type === "currency" && !currency)) return;
              onChange([
                ...exchanges,
                fetch.crystalizeExchange({
                  type,
                  value,
                  thing: type === "thing" ? thing : null,
                  currency: type === "currency" ? currency : null,
                  token: null,
                  product: null,
                  wallet: null,
                  originalValue: originalValue === 0 ? null : originalValue,
                }),
              ]);
            }}
          >
            <AiOutlinePlus />
          </button>
        </div>
      </div>
      {exchanges.map((exchange, idx) => (
        <div key={idx}>
          {exchange.type} / {exchange.thing?.name ?? exchange.currency?.name} / {exchange.value} /
          {exchange.originalValue}
          <button className="btn" onClick={() => onChange(exchanges.filter((_, i) => i !== idx))}>
            <AiOutlineDelete />
          </button>
        </div>
      ))}
    </>
  );
};
