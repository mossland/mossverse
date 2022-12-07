import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Skeleton } from "antd";
import { store, gql } from "@shared/data-access";
import { Field, Img } from "../index";
import { cnst, Utils } from "@shared/util";
import { SliceModel } from "@shared/util-client";

interface NetworksProps {
  networkType?: cnst.NetworkType;
  networkSlice: gql.NetworkSlice;
}
export const Networks = ({ networkType, networkSlice }: NetworksProps) => {
  const networkList = networkSlice.use.networkList();
  const networkModal = networkSlice.use.networkModal();
  useEffect(() => {
    networkSlice.do.initNetwork({ query: {} });
  }, []);

  return (
    <div>
      <Header>
        <h2>Networks</h2>
        <Button onClick={() => networkSlice.do.newNetwork()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {networkList === "loading" ? (
        <Skeleton />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={networkList}
          renderItem={(network) => <Network key={network.id} network={network} networkSlice={networkSlice} />}
        ></List>
      )}
      <NetworkEdit networkSlice={networkSlice} />
    </div>
  );
};

interface NetworkProps {
  network: gql.LightNetwork;
  networkSlice: gql.NetworkSlice;
}
export const Network = React.memo(({ network, networkSlice }: NetworkProps) => {
  return (
    <Card hoverable actions={[<EditOutlined key="edit" onClick={() => networkSlice.do.editNetwork(network.id)} />]}>
      <Card.Meta title={network.name} />
    </Card>
  );
});
interface NetworkEditProps {
  networkSlice: gql.NetworkSlice;
}
export const NetworkEdit = ({ networkSlice }: NetworkEditProps) => {
  const networkModal = networkSlice.use.networkModal();
  const networkForm = networkSlice.use.networkForm();
  const networkSumbit = networkSlice.use.networkSubmit();
  useEffect(() => {
    networkSlice.do.checkNetworkSubmitable();
  }, [networkForm]);
  return (
    <Modal
      title={networkForm.id ? "New Network" : `Network - ${networkForm.name}`}
      open={!!networkModal}
      onOk={networkSlice.do.submitNetwork}
      onCancel={() => networkSlice.do.resetNetwork()}
      okButtonProps={networkSumbit}
    >
      <Field.Container>
        <Field.Text label="Name" value={networkForm.name} onChange={networkSlice.do.setNameOnNetwork} />
        <Select
          value={networkForm.provider}
          style={{ width: "100%" }}
          onChange={networkSlice.do.setProviderOnNetwork}
          disabled={!!networkForm.id}
        >
          {cnst.networkProviders.map((provider) => (
            <Select.Option key={provider} value={provider}>
              {provider}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={networkForm.type}
          style={{ width: "100%" }}
          onChange={networkSlice.do.setTypeOnNetwork}
          disabled={!!networkForm.id}
        >
          {cnst.networkTypes.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
        <Field.Number
          label="Network ID"
          value={networkForm.networkId}
          onChange={networkSlice.do.setNetworkIdOnNetwork}
        />
        <Field.Text
          label="End Point"
          value={networkForm.endPoint}
          onChange={networkSlice.do.setEndPointOnNetwork}
          disabled={!!networkForm.id}
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
