import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm, Skeleton } from "antd";
import { store, gql } from "@shared/data-access";
import { Field, Img } from "../index";
import { SliceModel } from "@shared/util-client";

interface AdminsProps {
  adminSlice: gql.AdminSlice;
}
export const Admins = ({ adminSlice }: AdminsProps) => {
  const adminList = adminSlice.use.adminList();
  useEffect(() => {
    adminSlice.do.initAdmin();
  }, []);
  return (
    <div>
      <Header>
        <h2>Admins</h2>
        <Button onClick={() => adminSlice.do.newAdmin()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {adminList === "loading" ? (
        <Skeleton active />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={adminList}
          renderItem={(admin) => <Admin key={admin.id} admin={admin} adminSlice={adminSlice} />}
        ></List>
      )}
      <AdminEdit adminSlice={adminSlice} />
    </div>
  );
};

interface AdminProps {
  admin: gql.LightAdmin;
  adminSlice: gql.AdminSlice;
}
export const Admin = React.memo(({ admin, adminSlice }: AdminProps) => {
  return (
    <Card
      hoverable
      actions={[
        <EditOutlined key="edit" onClick={() => adminSlice.do.editAdmin(admin.id)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => adminSlice.do.removeAdmin(admin.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={admin.email} />
    </Card>
  );
});
interface AdminEditProps {
  adminSlice: gql.AdminSlice;
}
export const AdminEdit = ({ adminSlice }: AdminEditProps) => {
  const adminModal = adminSlice.use.adminModal();
  const adminForm = adminSlice.use.adminForm();
  const adminSumbit = adminSlice.use.adminSubmit();
  useEffect(() => {
    adminSlice.do.checkAdminSubmitable();
  }, [adminForm]);
  return (
    <Modal
      title={adminForm.id ? "New Admin" : `Admin - ${adminForm.accountId}`}
      open={adminModal === "edit"}
      onOk={() => adminSlice.do.submitAdmin()}
      onCancel={() => adminSlice.do.resetAdmin()}
      okButtonProps={adminSumbit}
    >
      <Field.Container>
        <Field.Text label="Account ID" value={adminForm.accountId} onChange={adminSlice.do.setAccountIdOnAdmin} />
        <Field.Text label="Email" value={adminForm.email} onChange={adminSlice.do.setEmailOnAdmin} />
        <Field.Password value={adminForm.password} onChange={adminSlice.do.setPasswordOnAdmin} />
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
