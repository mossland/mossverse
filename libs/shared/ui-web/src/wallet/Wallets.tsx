import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card } from "antd";
import { gql, store } from "@shared/data-access";

export const Wallets = () => {
  const init = store.wallet.use.init();
  const walletList = store.wallet.use.walletList();
  const newWallet = store.wallet.use.newWallet();
  useEffect(() => {
    // init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Wallets</h2>
        <Button onClick={newWallet} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={walletList}
        renderItem={(wallet) => <Wallet key={wallet.id} wallet={wallet} />}
      ></List>
    </div>
  );
};

interface WalletProps {
  wallet: gql.Wallet;
}
export const Wallet = React.memo(({ wallet }: WalletProps) => {
  const editWallet = store.wallet.use.editWallet();
  return (
    <Card hoverable actions={[<EditOutlined key="edit" onClick={() => editWallet(wallet)} />]}>
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
