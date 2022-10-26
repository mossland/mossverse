import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { contractStore, networkStore, types } from "@shared/data-access";
import { Field, Img } from "../index";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Contracts = () => {
  const init = contractStore.use.init();
  const contracts = contractStore.use.contracts();
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Contracts</h2>
        <Button
          onClick={() => contractStore.setState({ ...types.defaultContract, modalOpen: true })}
          icon={<PlusOutlined />}
        >
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={contracts}
        renderItem={(contract) => <Contract key={contract.id} contract={contract} />}
      ></List>
      <ContractEdit />
    </div>
  );
};

interface ContractProps {
  contract: types.Contract;
}
export const Contract = React.memo(({ contract }: ContractProps) => {
  const remove = contractStore.use.remove();
  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => contractStore.setState({ ...contract, modalOpen: true })} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => remove(contract.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={contract.displayName ?? contract.address} />
    </Card>
  );
});
export const ContractEdit = () => {
  const modalOpen = contractStore.use.modalOpen();
  const id = contractStore.use.id();
  const networks = networkStore.use.networks();
  const address = contractStore.use.address();
  const displayName = contractStore.use.displayName();
  const network = contractStore.use.network();
  const purify = contractStore.use.purify();
  const create = contractStore.use.create();
  const update = contractStore.use.update();
  return (
    <Modal
      title={id ? "New Contract" : `Contract - ${displayName ?? address}`}
      open={modalOpen}
      onOk={() => (id ? update() : create())}
      onCancel={() => contractStore.setState({ modalOpen: !modalOpen })}
      okButtonProps={{ disabled: !purify() }}
    >
      <Field.Container>
        <Select
          value={network}
          style={{ width: "100%" }}
          onChange={(network) => contractStore.setState({ network })}
          disabled={!!id}
        >
          {networks.map((network) => (
            <Select.Option value={network}>
              {network.name}/{network.provider}/{network.type}
            </Select.Option>
          ))}
        </Select>
        <Field.Text
          label="Address"
          value={address}
          onChange={(address) => contractStore.setState({ address })}
          disabled={!!id}
        />
        <Field.Text
          label="Name"
          value={displayName}
          onChange={(displayName) => contractStore.setState({ displayName })}
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
