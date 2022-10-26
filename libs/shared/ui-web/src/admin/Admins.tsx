import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { adminStore, types } from "@shared/data-access";
import { Field, Img } from "../index";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Admins = () => {
  const init = adminStore.use.init();
  const admins = adminStore.use.admins();
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Admins</h2>
        <Button onClick={() => adminStore.setState({ ...types.defaultAdmin, modalOpen: true })} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={admins}
        renderItem={(admin) => <Admin key={admin.id} admin={admin} />}
      ></List>
      <AdminEdit />
    </div>
  );
};

interface AdminProps {
  admin: types.Admin;
}
export const Admin = React.memo(({ admin }: AdminProps) => {
  const remove = adminStore.use.remove();
  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => adminStore.setState({ ...admin, modalOpen: true })} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => remove(admin.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={admin.email} />
    </Card>
  );
});
export const AdminEdit = () => {
  const modalOpen = adminStore.use.modalOpen();
  const id = adminStore.use.id();
  const accountId = adminStore.use.accountId();
  const password = adminStore.use.password();
  const email = adminStore.use.email();
  const purify = adminStore.use.purify();
  const create = adminStore.use.create();
  const update = adminStore.use.update();
  return (
    <Modal
      title={id ? "New Admin" : `Admin - ${accountId}`}
      open={modalOpen}
      onOk={() => (id ? update() : create())}
      onCancel={() => adminStore.setState({ modalOpen: !modalOpen })}
      okButtonProps={{ disabled: !purify() }}
    >
      <Field.Container>
        <Field.Text label="Account ID" value={accountId} onChange={(accountId) => adminStore.setState({ accountId })} />
        <Field.Text label="Email" value={email} onChange={(email) => adminStore.setState({ email })} />
        <Field.Password value={password} onChange={(password) => adminStore.setState({ password })} />
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
