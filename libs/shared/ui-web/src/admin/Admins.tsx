import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { store, gql } from "@shared/data-access";
import { Field, Img } from "../index";

export const Admins = () => {
  const initAdmin = store.admin.use.initAdmin();
  const adminList = store.admin.use.adminList();
  const newAdmin = store.admin.use.newAdmin();
  useEffect(() => {
    initAdmin();
  }, []);

  return (
    <div>
      <Header>
        <h2>Admins</h2>
        <Button onClick={newAdmin} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={adminList}
        renderItem={(admin) => <Admin key={admin.id} admin={admin} />}
      ></List>
      <AdminEdit />
    </div>
  );
};

interface AdminProps {
  admin: gql.Admin;
}
export const Admin = React.memo(({ admin }: AdminProps) => {
  const removeAdmin = store.admin.use.removeAdmin();
  const editAdmin = store.admin.use.editAdmin();
  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => editAdmin(admin)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => removeAdmin(admin.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={admin.email} />
    </Card>
  );
});
export const AdminEdit = () => {
  const adminModal = store.admin.use.adminModal();
  const id = store.admin.use.id();
  const accountId = store.admin.use.accountId();
  const password = store.admin.use.password();
  const email = store.admin.use.email();
  const purifyAdmin = store.admin.use.purifyAdmin();
  const createAdmin = store.admin.use.createAdmin();
  const updateAdmin = store.admin.use.updateAdmin();
  const resetAdmin = store.admin.use.resetAdmin();
  return (
    <Modal
      title={id ? "New Admin" : `Admin - ${accountId}`}
      open={!!adminModal}
      onOk={() => (id ? updateAdmin() : createAdmin())}
      onCancel={() => resetAdmin()}
      okButtonProps={{ disabled: !purifyAdmin() }}
    >
      <Field.Container>
        <Field.Text
          label="Account ID"
          value={accountId}
          onChange={(accountId) => store.admin.setState({ accountId })}
        />
        <Field.Text label="Email" value={email} onChange={(email) => store.admin.setState({ email })} />
        <Field.Password value={password} onChange={(password) => store.admin.setState({ password })} />
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
