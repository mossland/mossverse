import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm, Skeleton } from "antd";
import { gql, store } from "@platform/data-access";
import { Field, Img } from "@shared/ui-web";
import { cnst } from "@shared/util";

interface TradesProps {
  tradeSlice: gql.TradeSlice;
}
export const Trades = ({ tradeSlice }: TradesProps) => {
  const tradeList = tradeSlice.use.tradeList();
  const modalOpen = tradeSlice.use.tradeModal();
  useEffect(() => {
    tradeSlice.do.initTrade();
  }, []);

  return (
    <div>
      <Header>
        <h2>Trades</h2>
        <Button onClick={() => tradeSlice.do.newTrade()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {tradeList === "loading" ? (
        <Skeleton />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={tradeList}
          renderItem={(trade) => <Trade key={trade.id} trade={trade} tradeSlice={tradeSlice} />}
        ></List>
      )}
      <TradeEdit tradeSlice={tradeSlice} />
    </div>
  );
};

interface TradeProps {
  trade: gql.LightTrade;
  tradeSlice: gql.TradeSlice;
}
export const Trade = React.memo(({ trade, tradeSlice }: TradeProps) => {
  return (
    <Card
      hoverable
      // cover={<img alt="file" src={trade.image.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => tradeSlice.do.editTrade(trade.id)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => tradeSlice.do.removeTrade(trade.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={trade.name} />
    </Card>
  );
});
interface TradeEditProps {
  tradeSlice: gql.TradeSlice;
}
export const TradeEdit = ({ tradeSlice }: TradeEditProps) => {
  const modalOpen = tradeSlice.use.tradeModal();
  const tradeForm = tradeSlice.use.tradeForm();
  const tradeSumbit = tradeSlice.use.tradeSubmit();

  useEffect(() => {
    tradeSlice.do.checkTradeSubmitable();
  }, [tradeForm]);
  return (
    <Modal
      width="80%"
      title={tradeForm.id ? "New Trade" : `Trade - ${tradeForm.name}`}
      open={!!modalOpen}
      onOk={tradeSlice.do.submitTrade}
      onCancel={() => tradeSlice.do.resetTrade()}
      okButtonProps={tradeSumbit}
    >
      <Field.Container>
        <Field.Text label="Name" value={tradeForm.name} onChange={tradeSlice.do.setNameOnTrade} />
        {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => tradeSlice.setState({ type })}>
          {cnst.tradeTypes.map((type) => (
            <Select.Option value={type}>{type}</Select.Option>
          ))}
        </Select> */}
        <Select
          value={tradeForm.policy}
          style={{ width: "100%" }}
          mode="multiple"
          allowClear
          onChange={tradeSlice.do.setPolicyOnTrade}
        >
          {cnst.tradePolicies.map((policy) => (
            <Select.Option key={policy} value={policy}>
              {policy}
            </Select.Option>
          ))}
        </Select>
        <ExchangeEdit label="Input" value={tradeForm.inputs} onChange={tradeSlice.do.setInputsOnTrade} />
        <ExchangeEdit label="Output" value={tradeForm.outputs} onChange={tradeSlice.do.setOutputsOnTrade} />
      </Field.Container>
    </Modal>
  );
};

interface ExchangeEditProps {
  label: string;
  value: gql.Exchange[];
  onChange: (exchanges: gql.Exchange[]) => void;
}
export const ExchangeEdit = ({ label, value, onChange }: ExchangeEditProps) => {
  const [type, setType] = useState<cnst.ExchangeType>("currency");
  const [num, setNum] = useState<number>(0);
  const [originalNum, setOriginalNum] = useState<number>(0);
  const [thing, setThing] = useState<gql.shared.LightThing | null>(null);
  const [currency, setCurrency] = useState<gql.shared.LightCurrency | null>(null);

  //! temp code
  const currencyList = store.shared.currency.use.currencyList();
  const thingList = store.shared.thing.use.thingList();
  useEffect(() => {
    if (type === "currency") store.shared.currency.do.initCurrency();
    if (type === "thing") store.shared.thing.do.initThing();
  }, [type]);

  return (
    <>
      <Space>
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
        <Field.Number label="Num" value={num} onChange={setNum} />
        <Field.Number label="OriginalNum" value={originalNum} onChange={setOriginalNum} />
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            if (num === 0 || (type === "thing" && !thing) || (type === "currency" && !currency)) return;
            onChange([
              ...value,
              {
                type,
                num,
                thing: type === "thing" ? thing : null,
                currency: type === "currency" ? currency : null,
                token: null,
                product: null,
                wallet: null,
                originalNum: originalNum === 0 ? null : originalNum,
              },
            ]);
          }}
        />
      </Space>
      {value.map((exchange, idx) => (
        <div key={idx}>
          {exchange.type} / {exchange.thing?.name ?? exchange.currency?.name} / {exchange.num} / {exchange.originalNum}
          <Button icon={<DeleteOutlined />} onClick={() => onChange(value.filter((_, i) => i !== idx))} />
        </div>
      ))}
    </>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 60px 0 10px 0;
  h2 {
    font-size: 20px;
  }
`;
