import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { gql, store } from "@shared/data-access";
import { Field, Img } from "../index";
import { Utils } from "@shared/util";

export const Contracts = () => {
  const initContract = store.contract.use.initContract();
  const contractList = store.contract.use.contractList();
  const newContract = store.contract.use.newContract();
  useEffect(() => {
    initContract();
  }, []);

  return (
    <div>
      <Header>
        <h2>Contracts</h2>
        <Button onClick={newContract} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={contractList}
        renderItem={(contract) => <Contract key={contract.id} contract={contract} />}
      ></List>
      <ContractEdit />
    </div>
  );
};

interface ContractProps {
  contract: gql.Contract;
}
export const Contract = React.memo(({ contract }: ContractProps) => {
  const removeContract = store.contract.use.removeContract();
  const editContract = store.contract.use.editContract();
  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => editContract(contract)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => removeContract(contract.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={contract.displayName ?? contract.address} />
    </Card>
  );
});
export const ContractEdit = () => {
  const contractModal = store.contract.use.contractModal();
  const id = store.contract.use.id();
  const networks = store.network.use.networkList();
  const address = store.contract.use.address();
  const displayName = store.contract.use.displayName();
  const network = store.contract.use.network();
  const purifyContract = store.contract.use.purifyContract();
  const createContract = store.contract.use.createContract();
  const updateContract = store.contract.use.updateContract();
  const resetContract = store.contract.use.resetContract();
  return (
    <Modal
      title={id ? "New Contract" : `Contract - ${displayName ?? address}`}
      open={!!contractModal}
      onOk={() => (id ? updateContract() : createContract())}
      onCancel={() => resetContract()}
      okButtonProps={{ disabled: !purifyContract() }}
    >
      <Field.Container>
        <Select
          value={network?.name}
          style={{ width: "100%" }}
          onChange={(networkId) =>
            store.contract.setState({ network: networks.find((network) => network.id === networkId) })
          }
          disabled={!!id}
        >
          {networks.map((network) => (
            <Select.Option key={network.id} value={network.id}>
              {network.name}/{network.provider}/{network.type}
            </Select.Option>
          ))}
        </Select>
        <Field.Text
          label="Address"
          value={address}
          onChange={(address) => store.contract.setState({ address })}
          disabled={!!id}
        />
        <Field.Text
          label="Name"
          value={displayName}
          onChange={(displayName) => store.contract.setState({ displayName })}
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
