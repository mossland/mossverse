import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { gql, store } from "@shared/data-access";
import { Field, Img } from "../index";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Tokens = () => {
  const initToken = store.token.use.initToken();
  const tokens = store.token.use.tokenList();
  const tokenModal = store.token.use.tokenModal();
  const newToken = store.token.use.newToken();

  useEffect(() => {
    initToken();
  }, []);

  return (
    <div>
      <Header>
        <h2>Tokens</h2>
        <Button onClick={newToken} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={tokens}
        renderItem={(token) => <Token key={token.id} token={token} />}
      ></List>
      <TokenEdit />
    </div>
  );
};

interface TokenProps {
  token: gql.Token;
}
export const Token = React.memo(({ token }: TokenProps) => {
  const editToken = store.token.use.editToken();
  const removeToken = store.token.use.removeToken();
  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => editToken(token)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => removeToken(token.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={`${token.contract.displayName ?? token.contract.address}/${token.tokenId ?? ""}`} />
    </Card>
  );
});
export const TokenEdit = () => {
  const tokenModal = store.token.use.tokenModal();
  const id = store.token.use.id();
  const contractList = store.contract.use.contractList();
  const setContract = store.contract.use.setContract();
  const tokenId = store.token.use.tokenId();
  const uri = store.token.use.uri();
  const meta = store.token.use.meta();
  const image = store.token.use.image();
  const contract = store.token.use.contract();
  const purifyToken = store.token.use.purifyToken();
  const createToken = store.token.use.createToken();
  const updateToken = store.token.use.updateToken();
  const resetToken = store.token.use.resetToken();
  return (
    <Modal
      title={id ? "New Token" : `Token - ${contract?.displayName ?? contract?.address}/${tokenId ?? "Token"}`}
      open={!!tokenModal}
      onOk={() => (id ? updateToken() : createToken())}
      onCancel={() => resetToken()}
      // okButtonProps={{ disabled: !purify() }}
    >
      <Field.Container>
        <Select
          value={contract}
          style={{ width: "100%" }}
          onChange={(contract) => setContract(contract)}
          disabled={!!id}
        >
          {contractList.map((contract) => (
            <Select.Option value={contract}>{contract?.displayName ?? contract?.address}</Select.Option>
          ))}
        </Select>
        <Field.Number label="Token ID" value={tokenId} onChange={(tokenId) => store.token.setState({ tokenId })} />

        <Field.Text label="tokenURI" value={uri} onChange={(uri) => store.token.setState({ uri })} disabled={true} />
        <Field.Text
          label="meta"
          value={JSON.stringify(meta)}
          onChange={(meta) => {
            //
          }}
          disabled={true}
        />
        <Field.Img
          label="Image"
          addFiles={(fileList) => {
            //
          }}
          file={image}
          onRemove={() => store.token.setState({ image: null })}
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
