import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Skeleton } from "antd";
import { gql, store } from "@shared/data-access";
import { Field, Img } from "@shared/ui-web";
import { cnst, Utils } from "@shared/util";

interface CurrenciesProps {
  currencySlice: gql.CurrencySlice;
}
export const Currencies = ({ currencySlice }: CurrenciesProps) => {
  const currencyList = currencySlice.use.currencyList();
  const currencyModal = currencySlice.use.currencyModal();
  useEffect(() => {
    currencySlice.do.initCurrency();
  }, []);

  return (
    <div>
      <Header>
        <h2>Currencies</h2>
        <Button onClick={() => currencySlice.do.newCurrency()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {currencyList === "loading" ? (
        <Skeleton />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={currencyList}
          renderItem={(currency) => <Currency key={currency.id} currency={currency} currencySlice={currencySlice} />}
        />
      )}

      <CurrencyEdit currencySlice={currencySlice} />
    </div>
  );
};
interface CurrencyProps {
  currency: gql.LightCurrency;
  currencySlice: gql.CurrencySlice;
}
export const Currency = React.memo(({ currency, currencySlice }: CurrencyProps) => {
  return (
    <Card
      hoverable
      // cover={<img alt="cover" src={currency.thumbnails[0]?.url} />}
      actions={[<EditOutlined key="edit" onClick={() => currencySlice.do.editCurrency(currency.id)} />]}
    >
      <Card.Meta title={currency.name} />
    </Card>
  );
});
interface CurrencyEditProps {
  currencySlice: gql.CurrencySlice;
}
export const CurrencyEdit = ({ currencySlice }: CurrencyEditProps) => {
  const currencyModal = currencySlice.use.currencyModal();
  const currencyForm = currencySlice.use.currencyForm();
  const currencySumbit = currencySlice.use.currencySubmit();
  useEffect(() => {
    currencySlice.do.checkCurrencySubmitable();
  }, [currencyForm]);
  return (
    <Modal
      title={currencyForm.id ? "New Currency" : `Currency - ${currencyForm.name}`}
      open={!!currencyModal}
      onOk={currencySlice.do.submitCurrency}
      onCancel={() => currencySlice.do.resetCurrency()}
      okButtonProps={currencySumbit}
    >
      <Field.Container>
        <Field.Text label="Name" value={currencyForm.name} onChange={currencySlice.do.setNameOnCurrency} />
        <Select value={currencyForm.symbol} onChange={currencySlice.do.setSymbolOnCurrency} style={{ width: "100%" }}>
          {cnst.currencySymbols.map((symbol) => (
            <Select.Option key={symbol} value={symbol}>
              {symbol}
            </Select.Option>
          ))}
        </Select>
        <Select value={currencyForm.type} onChange={currencySlice.do.setTypeOnCurrency} style={{ width: "100%" }}>
          {cnst.currencyTypes.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
        <Field.Tags label="Services" values={currencyForm.services} onUpdate={currencySlice.do.setServicesOnCurrency} />
      </Field.Container>
    </Modal>
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
