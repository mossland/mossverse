import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm, Skeleton } from "antd";
import { gql } from "@shared/data-access";
import { Field, Img } from "../index";
import { SliceModel } from "@shared/util-client";

interface ThingsProps {
  thingSlice: gql.ThingSlice;
}
export const Things = ({ thingSlice }: ThingsProps) => {
  const thingList = thingSlice.use.thingList();
  const modalOpen = thingSlice.use.thingModal();
  useEffect(() => {
    thingSlice.do.initThing();
  }, []);

  return (
    <div>
      <Header>
        <h2>Things</h2>
        <Button onClick={() => thingSlice.do.newThing()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {thingList === "loading" ? (
        <Skeleton />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={thingList}
          renderItem={(thing) => <Thing key={thing.id} thing={thing} thingSlice={thingSlice} />}
        ></List>
      )}
      <ThingEdit thingSlice={thingSlice} />
    </div>
  );
};

interface ThingProps {
  thing: gql.LightThing;
  thingSlice: gql.ThingSlice;
}
export const Thing = React.memo(({ thing, thingSlice }: ThingProps) => {
  return (
    <Card
      hoverable
      cover={<img alt="file" src={thing.image.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => thingSlice.do.editThing(thing.id)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => thingSlice.do.removeThing(thing.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={thing.name} />
    </Card>
  );
});
interface ThingEditProps {
  thingSlice: gql.ThingSlice;
}
export const ThingEdit = ({ thingSlice }: ThingEditProps) => {
  const modalOpen = thingSlice.use.thingModal();
  const thingForm = thingSlice.use.thingForm();
  const thingSumbit = thingSlice.use.thingSubmit();
  useEffect(() => {
    thingSlice.do.checkThingSubmitable();
  }, [thingForm]);
  return (
    <Modal
      title={thingForm.id ? "New Thing" : `Thing - ${thingForm.name}`}
      open={!!modalOpen}
      onOk={thingSlice.do.submitThing}
      onCancel={() => thingSlice.do.resetThing()}
      okButtonProps={thingSumbit}
    >
      <Field.Container>
        <Field.Text label="Name" value={thingForm.name} onChange={thingSlice.do.setNameOnThing} />
        <Field.Text label="Description" value={thingForm.description} onChange={thingSlice.do.setDescriptionOnThing} />
        {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => thingSlice.setState({ type })}>
          {cnst.thingTypes.map((type) => (
            <Select.Option value={type}>{type}</Select.Option>
          ))}
        </Select> */}
        <Field.Img
          label="Image"
          addFiles={thingSlice.do.uploadImageOnThing}
          file={thingForm.image}
          onRemove={() => thingSlice.do.setImageOnThing(null)}
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
