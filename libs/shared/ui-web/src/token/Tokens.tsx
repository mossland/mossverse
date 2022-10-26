import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { contractStore, tokenStore, types } from "@shared/data-access";
import { Field, Img } from "../index";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Tokens = () => {
  const init = tokenStore.use.init();
  const tokens = tokenStore.use.tokens();
  const modalOpen = tokenStore.use.modalOpen();
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Tokens</h2>
        <Button onClick={() => tokenStore.setState({ ...types.defaultToken, modalOpen: true })} icon={<PlusOutlined />}>
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
  token: types.Token;
}
export const Token = React.memo(({ token }: TokenProps) => {
  const remove = tokenStore.use.remove();
  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => tokenStore.setState({ ...token, modalOpen: true })} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => remove(token.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={`${token.contract.displayName ?? token.contract.address}/${token.tokenId ?? ""}`} />
    </Card>
  );
});
export const TokenEdit = () => {
  const modalOpen = tokenStore.use.modalOpen();
  const id = tokenStore.use.id();
  const contracts = contractStore.use.contracts();
  const tokenId = tokenStore.use.tokenId();
  const uri = tokenStore.use.uri();
  const meta = tokenStore.use.meta();
  const image = tokenStore.use.image();
  const contract = tokenStore.use.contract();
  const purify = tokenStore.use.purify();
  const create = tokenStore.use.create();
  const update = tokenStore.use.update();
  return (
    <Modal
      title={id ? "New Token" : `Token - ${contract?.displayName ?? contract?.address}/${tokenId ?? "Token"}`}
      open={modalOpen}
      onOk={() => (id ? update() : create())}
      onCancel={() => tokenStore.setState({ modalOpen: !modalOpen })}
      // okButtonProps={{ disabled: !purify() }}
    >
      <Field.Container>
        <Select
          value={contract}
          style={{ width: "100%" }}
          onChange={(contract) => contractStore.setState({ contract })}
          disabled={!!id}
        >
          {contracts.map((contract) => (
            <Select.Option value={contract}>{contract?.displayName ?? contract?.address}</Select.Option>
          ))}
        </Select>
        <Field.Number label="Token ID" value={tokenId} onChange={(tokenId) => tokenStore.setState({ tokenId })} />

        <Field.Text label="tokenURI" value={uri} onChange={(uri) => tokenStore.setState({ uri })} disabled={true} />
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
          onChange={(fileList) => {
            //
          }}
          value={image}
          onRemove={() => tokenStore.setState({ image: null })}
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
