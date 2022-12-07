import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm, Skeleton } from "antd";
import { gql, store } from "@platform/data-access";
import { Field, Img } from "@shared/ui-web";
import { cnst } from "@shared/util";

interface ReceiptsProps {
  receiptSlice: gql.ReceiptSlice;
}
export const Receipts = ({ receiptSlice }: ReceiptsProps) => {
  const receiptList = receiptSlice.use.receiptList();
  const modalOpen = receiptSlice.use.receiptModal();
  useEffect(() => {
    receiptSlice.do.initReceipt();
  }, []);

  return (
    <div>
      <Header>
        <h2>Receipts</h2>
        <Button onClick={() => receiptSlice.do.newReceipt()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {receiptList === "loading" ? (
        <Skeleton />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={receiptList}
          renderItem={(receipt) => <Receipt key={receipt.id} receipt={receipt} receiptSlice={receiptSlice} />}
        ></List>
      )}
    </div>
  );
};

interface ReceiptProps {
  receipt: gql.LightReceipt;
  receiptSlice: gql.ReceiptSlice;
}
export const Receipt = React.memo(({ receipt, receiptSlice }: ReceiptProps) => {
  return (
    <Card
      hoverable
      // cover={<img alt="file" src={receipt.image.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => receiptSlice.do.editReceipt(receipt.id)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => receiptSlice.do.removeReceipt(receipt.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={receipt.name} />
    </Card>
  );
});

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 60px 0 10px 0;
  h2 {
    font-size: 20px;
  }
`;
