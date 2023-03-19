import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined, NodeIndexOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { gql, st, slice } from "@platform/data-access";
import { cnst } from "@shared/util";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "@shared/ui-web";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";

export const TradeMenuItem: DataMenuItem = {
  key: "trade",
  label: "Trade",
  icon: <NodeIndexOutlined />,
  render: () => <Trades />,
};
export const Trades = ({ slice = st.slice.trade, init }: ModelsProps<slice.TradeSlice, gql.Trade>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<TradeEdit slice={slice} />}
      renderItem={Trade}
      columns={["policy"]}
      actions={["edit"]}
    />
  );
};
export const Trade = ({
  trade,
  slice = st.slice.trade,
  actions,
  columns,
}: ModelProps<slice.TradeSlice, gql.LightTrade>) => {
  return <DataItem title={trade.name} model={trade} slice={slice} actions={actions} columns={columns} />;
};

export const TradeEdit = ({ slice }: ModelEditProps<slice.TradeSlice>) => {
  const tradeForm = slice.use.tradeForm();
  return (
    <DataEditModal slice={slice} renderTitle={(trade: DefaultOf<gql.Trade>) => `${trade.name}`}>
      <Field.Text label="Name" value={tradeForm.name} onChange={slice.do.setNameOnTrade} />
      {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => slice.setState({ type })}>
          {cnst.tradeTypes.map((type) => (
            <Select.Option value={type}>{type}</Select.Option>
          ))}
        </Select> */}
      <Field.SelectItem
        label="Policy"
        items={cnst.tradePolicies}
        value={tradeForm.policy}
        onChange={slice.do.setPolicyOnTrade}
        mode="multiple"
      />
      <ExchangeEdit label="Input" exchanges={tradeForm.inputs} onChange={slice.do.setInputsOnTrade} />
      <ExchangeEdit label="Output" exchanges={tradeForm.outputs} onChange={slice.do.setOutputsOnTrade} />
    </DataEditModal>
  );
};

interface ExchangeEditProps {
  label: string;
  exchanges: gql.Exchange[];
  onChange: (exchanges: gql.Exchange[]) => void;
}
export const ExchangeEdit = ({ label, exchanges, onChange }: ExchangeEditProps) => {
  const [type, setType] = useState<cnst.ExchangeType>("currency");
  const [value, setValue] = useState<number>(0);
  const [originalValue, setOriginalValue] = useState<number>(0);
  const [thing, setThing] = useState<gql.shared.LightThing | null>(null);
  const [currency, setCurrency] = useState<gql.shared.LightCurrency | null>(null);

  //! temp code
  const currencyList = st.use.currencyList();
  const thingList = st.use.thingList();
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
          {type === "currency" && currencyList !== "loading" && (
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
          {type === "thing" && thingList !== "loading" && (
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
                gql.crystalizeExchange({
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
            <PlusOutlined />
          </button>
        </div>
      </div>
      {exchanges.map((exchange, idx) => (
        <div key={idx}>
          {exchange.type} / {exchange.thing?.name ?? exchange.currency?.name} / {exchange.value} /
          {exchange.originalValue}
          <button className="btn" onClick={() => onChange(exchanges.filter((_, i) => i !== idx))}>
            <DeleteOutlined />
          </button>
        </div>
      ))}
    </>
  );
};
