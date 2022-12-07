import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm, Skeleton } from "antd";
import { gql, store } from "@shared/data-access";
import { Field, Img } from "../index";
import { Utils } from "@shared/util";
import { SliceModel } from "@shared/util-client";

interface ContractsProps {
  networkSlice: gql.NetworkSlice;
  contractSlice: gql.ContractSlice;
}

export const Contracts = ({ networkSlice, contractSlice }: ContractsProps) => {
  const contractList = contractSlice.use.contractList();
  useEffect(() => {
    contractSlice.do.initContract();
  }, []);

  return (
    <div>
      <Header>
        <h2>Contracts</h2>
        <Button onClick={() => contractSlice.do.newContract()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {contractList === "loading" ? (
        <Skeleton />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={contractList}
          renderItem={(contract) => <Contract key={contract.id} contract={contract} contractSlice={contractSlice} />}
        ></List>
      )}
      <ContractEdit networkSlice={networkSlice} contractSlice={contractSlice} />
    </div>
  );
};

interface ContractProps {
  contract: gql.LightContract;
  contractSlice: gql.ContractSlice;
}
export const Contract = React.memo(({ contract, contractSlice }: ContractProps) => {
  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => contractSlice.do.editContract(contract.id)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => contractSlice.do.removeContract(contract.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={contract.displayName ?? contract.address} />
    </Card>
  );
});
interface ContractEditProps {
  networkSlice: gql.NetworkSlice;
  contractSlice: gql.ContractSlice;
}
export const ContractEdit = ({ contractSlice, networkSlice }: ContractEditProps) => {
  const contractModal = contractSlice.use.contractModal();
  const networkList = networkSlice.use.networkList();
  const contractForm = contractSlice.use.contractForm();
  const contractSumbit = contractSlice.use.contractSubmit();
  useEffect(() => {
    networkSlice.do.initNetwork();
  }, []);
  useEffect(() => {
    contractSlice.do.checkContractSubmitable();
  }, [contractForm]);
  return (
    <Modal
      title={contractForm.id ? "New Contract" : `Contract - ${contractForm.displayName ?? contractForm.address}`}
      open={!!contractModal}
      onOk={contractSlice.do.submitContract}
      onCancel={() => contractSlice.do.resetContract()}
      okButtonProps={contractSumbit}
    >
      <Field.Container>
        {networkList === "loading" ? (
          <Skeleton.Input />
        ) : (
          <Select
            value={contractForm.network?.name}
            style={{ width: "100%" }}
            onChange={(networkId) =>
              contractSlice.do.setNetworkOnContract(networkList.find((network) => network.id === networkId))
            }
            disabled={!!contractForm.id}
          >
            {networkList.map((network) => (
              <Select.Option key={network.id} value={network.id}>
                {network.name}/{network.provider}/{network.type}
              </Select.Option>
            ))}
          </Select>
        )}
        <Field.Text
          label="Address"
          value={contractForm.address}
          onChange={contractSlice.do.setAddressOnContract}
          disabled={!!contractForm.id}
        />
        <Field.Text
          label="Name"
          value={contractForm.displayName}
          onChange={contractSlice.do.setDisplayNameOnContract}
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
