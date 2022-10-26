import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card } from "antd";
import { walletStore, types } from "@shared/data-access";
import { Field, Img } from "../index";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Wallets = () => {
  const init = walletStore.use.init();
  const wallets = walletStore.use.wallets();
  const modalOpen = walletStore.use.modalOpen();
  useEffect(() => {
    // init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Wallets</h2>
        <Button
          onClick={() => walletStore.setState({ ...types.defaultWallet, modalOpen: true })}
          icon={<PlusOutlined />}
        >
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={wallets}
        renderItem={(wallet) => <Wallet key={wallet.id} wallet={wallet} />}
      ></List>
    </div>
  );
};

interface WalletProps {
  wallet: types.Wallet;
}
export const Wallet = React.memo(({ wallet }: WalletProps) => {
  return (
    <Card
      hoverable
      actions={[<EditOutlined key="edit" onClick={() => walletStore.setState({ ...wallet, modalOpen: true })} />]}
    >
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
