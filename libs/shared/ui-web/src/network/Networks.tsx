import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card } from "antd";
import { store, gql } from "@shared/data-access";
import { Field, Img } from "../index";
import { cnst, Utils } from "@shared/util";

export const Networks = ({ networkType }: { networkType: cnst.NetworkType }) => {
  const initNetwork = store.network.use.initNetwork();
  const networkList = store.network.use.networkList();
  const networkModal = store.network.use.networkModal();
  const newNetwork = store.network.use.newNetwork();
  useEffect(() => {
    initNetwork({ networkType });
  }, []);

  return (
    <div>
      <Header>
        <h2>Networks</h2>
        <Button onClick={newNetwork} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={networkList}
        renderItem={(network) => <Network key={network.id} network={network} />}
      ></List>
      <NetworkEdit />
    </div>
  );
};

interface NetworkProps {
  network: gql.Network;
}
export const Network = React.memo(({ network }: NetworkProps) => {
  const editNetwork = store.network.use.editNetwork();
  return (
    <Card hoverable actions={[<EditOutlined key="edit" onClick={() => editNetwork(network)} />]}>
      <Card.Meta title={network.name} />
    </Card>
  );
});
export const NetworkEdit = () => {
  const networkModal = store.network.use.networkModal();
  const id = store.network.use.id();
  const name = store.network.use.name();
  const networkId = store.network.use.networkId();
  const provider = store.network.use.provider();
  const type = store.network.use.type();
  const endPoint = store.network.use.endPoint();
  const purifyNetwork = store.network.use.purifyNetwork();
  const createNetwork = store.network.use.createNetwork();
  const updateNetwork = store.network.use.updateNetwork();
  const resetNetwork = store.network.use.resetNetwork();
  return (
    <Modal
      title={id ? "New Network" : `Network - ${name}`}
      open={!!networkModal}
      onOk={() => (id ? updateNetwork() : createNetwork())}
      onCancel={() => resetNetwork()}
      okButtonProps={{ disabled: !purifyNetwork() }}
    >
      <Field.Container>
        <Field.Text label="Name" value={name} onChange={(name) => store.network.setState({ name })} />
        <Select
          value={provider}
          style={{ width: "100%" }}
          onChange={(provider) => store.network.setState({ provider })}
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
          onChange={(type) => store.network.setState({ type })}
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
          onChange={(networkId) => store.network.setState({ networkId })}
        />
        <Field.Text
          label="End Point"
          value={endPoint}
          onChange={(endPoint) => store.network.setState({ endPoint })}
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
