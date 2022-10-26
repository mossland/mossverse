import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card } from "antd";
import { networkStore, types } from "@shared/data-access";
import { Field, Img } from "../index";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { cnst, Utils } from "@shared/util";

export const Networks = ({ networkType }: { networkType: cnst.NetworkType }) => {
  const init = networkStore.use.init();
  const networks = networkStore.use.networks();
  const modalOpen = networkStore.use.modalOpen();
  useEffect(() => {
    init(networkType);
  }, []);

  return (
    <div>
      <Header>
        <h2>Networks</h2>
        <Button
          onClick={() => networkStore.setState({ ...types.defaultNetwork, modalOpen: true })}
          icon={<PlusOutlined />}
        >
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={networks}
        renderItem={(network) => <Network key={network.id} network={network} />}
      ></List>
      <NetworkEdit />
    </div>
  );
};

interface NetworkProps {
  network: types.Network;
}
export const Network = React.memo(({ network }: NetworkProps) => {
  return (
    <Card
      hoverable
      actions={[<EditOutlined key="edit" onClick={() => networkStore.setState({ ...network, modalOpen: true })} />]}
    >
      <Card.Meta title={network.name} />
    </Card>
  );
});
export const NetworkEdit = () => {
  const modalOpen = networkStore.use.modalOpen();
  const id = networkStore.use.id();
  const name = networkStore.use.name();
  const networkId = networkStore.use.networkId();
  const provider = networkStore.use.provider();
  const type = networkStore.use.type();
  const endPoint = networkStore.use.endPoint();
  const purify = networkStore.use.purify();
  const create = networkStore.use.create();
  const update = networkStore.use.update();
  return (
    <Modal
      title={id ? "New Network" : `Network - ${name}`}
      open={modalOpen}
      onOk={() => (id ? update() : create())}
      onCancel={() => networkStore.setState({ modalOpen: !modalOpen })}
      okButtonProps={{ disabled: !purify() }}
    >
      <Field.Container>
        <Field.Text label="Name" value={name} onChange={(name) => networkStore.setState({ name })} />
        <Select
          value={provider}
          style={{ width: "100%" }}
          onChange={(provider) => networkStore.setState({ provider })}
          disabled={!!id}
        >
          {cnst.networkProviders.map((provider) => (
            <Select.Option key={provider} value={provider}>
              {provider}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={type}
          style={{ width: "100%" }}
          onChange={(type) => networkStore.setState({ type })}
          disabled={!!id}
        >
          {cnst.networkTypes.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
        <Field.Number
          label="Network ID"
          value={networkId}
          onChange={(networkId) => networkStore.setState({ networkId })}
        />
        <Field.Text
          label="End Point"
          value={endPoint}
          onChange={(endPoint) => networkStore.setState({ endPoint })}
          disabled={!!id}
        />
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
