import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Skeleton } from "antd";
import { gql, store } from "@shared/data-access";
import { SliceModel } from "@shared/util-client";

interface WalletsProps {
  walletSlice: gql.WalletSlice;
}
export const Wallets = ({ walletSlice }: WalletsProps) => {
  const walletList = walletSlice.use.walletList();
  useEffect(() => {
    // init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Wallets</h2>
        <Button onClick={() => walletSlice.do.newWallet()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {walletList === "loading" ? (
        <Skeleton />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={walletList}
          renderItem={(wallet) => <Wallet key={wallet.id} wallet={wallet} walletSlice={walletSlice} />}
        ></List>
      )}
    </div>
  );
};

interface WalletProps {
  wallet: gql.LightWallet;
  walletSlice: gql.WalletSlice;
}
export const Wallet = React.memo(({ wallet, walletSlice }: WalletProps) => {
  return (
    <Card hoverable actions={[<EditOutlined key="edit" onClick={() => walletSlice.do.editWallet(wallet.id)} />]}>
      <Card.Meta title={wallet.address} />
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
