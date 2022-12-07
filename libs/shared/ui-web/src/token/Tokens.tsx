import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm, Skeleton } from "antd";
import { gql, store } from "@shared/data-access";
import { Field, Img } from "../index";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";
import { SliceModel } from "@shared/util-client";

interface TokensProps {
  tokenSlice: gql.TokenSlice;
  contractSlice: gql.ContractSlice;
}

export const Tokens = ({ tokenSlice, contractSlice }: TokensProps) => {
  const tokenList = tokenSlice.use.tokenList();
  const tokenModal = tokenSlice.use.tokenModal();
  useEffect(() => {
    tokenSlice.do.initToken();
  }, []);

  return (
    <div>
      <Header>
        <h2>Tokens</h2>
        <Button onClick={() => tokenSlice.do.newToken()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {tokenList === "loading" ? (
        <Skeleton />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={tokenList}
          renderItem={(token) => <Token key={token.id} token={token} tokenSlice={tokenSlice} />}
        ></List>
      )}
      <TokenEdit tokenSlice={tokenSlice} contractSlice={contractSlice} />
    </div>
  );
};

interface TokenProps {
  token: gql.LightToken;
  tokenSlice: gql.TokenSlice;
}
export const Token = React.memo(({ token, tokenSlice }: TokenProps) => {
  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => tokenSlice.do.editToken(token.id)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => tokenSlice.do.removeToken(token.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={`${token.contract.displayName ?? token.contract.address}/${token.tokenId ?? ""}`} />
    </Card>
  );
});
interface TokenEditProps {
  tokenSlice: gql.TokenSlice;
  contractSlice: gql.ContractSlice;
}
export const TokenEdit = ({ tokenSlice, contractSlice }: TokenEditProps) => {
  const tokenForm = tokenSlice.use.tokenForm();
  const tokenModal = tokenSlice.use.tokenModal();
  const contractList = contractSlice.use.contractList();
  const tokenSumbit = tokenSlice.use.tokenSubmit();
  useEffect(() => {
    tokenSlice.do.checkTokenSubmitable();
  }, [tokenForm]);
  return (
    <Modal
      title={
        tokenForm.id
          ? "New Token"
          : `Token - ${tokenForm.contract?.displayName ?? tokenForm.contract?.address}/${tokenForm.tokenId ?? "Token"}`
      }
      open={!!tokenModal}
      onOk={tokenSlice.do.submitToken}
      onCancel={() => tokenSlice.do.resetToken()}
      okButtonProps={tokenSumbit}
    >
      <Field.Container>
        {contractList === "loading" ? (
          <Skeleton.Input />
        ) : (
          <Select
            value={tokenForm.contract}
            style={{ width: "100%" }}
            onChange={tokenSlice.do.setContractOnToken}
            disabled={!!tokenForm.id}
          >
            {contractList.map((contract) => (
              <Select.Option value={contract}>{contract?.displayName ?? contract?.address}</Select.Option>
            ))}
          </Select>
        )}

        <Field.Number label="Token ID" value={tokenForm.tokenId} onChange={tokenSlice.do.setTokenIdOnToken} />

        <Field.Text label="tokenURI" value={tokenForm.uri} onChange={tokenSlice.do.setUriOnToken} disabled={true} />
        <Field.Text
          label="meta"
          value={JSON.stringify(tokenForm.meta)}
          onChange={(meta) => {
            //
          }}
          disabled={true}
        />
        <Field.Img
          label="Image"
          addFiles={tokenSlice.do.uploadImageOnToken}
          file={tokenForm.image}
          onRemove={() => tokenSlice.do.setImageOnToken(null)}
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
