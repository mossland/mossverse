import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { store, gql } from "@shared/data-access";
import { Field, Img } from "../index";

export const Things = () => {
  const initThing = store.thing.use.initThing();
  const thingList = store.thing.use.thingList();
  const modalOpen = store.thing.use.thingModal();
  const newThing = store.thing.use.newThing();

  useEffect(() => {
    initThing();
  }, []);

  return (
    <div>
      <Header>
        <h2>Things</h2>
        <Button onClick={newThing} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={thingList}
        renderItem={(thing) => <Thing key={thing.id} thing={thing} />}
      ></List>
      <ThingEdit />
    </div>
  );
};

interface ThingProps {
  thing: gql.Thing;
}
export const Thing = React.memo(({ thing }: ThingProps) => {
  const editThing = store.thing.use.editThing();
  const removeThing = store.thing.use.removeThing();
  return (
    <Card
      hoverable
      cover={<img alt="file" src={thing.image.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => editThing(thing)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => removeThing(thing.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={thing.name} />
    </Card>
  );
});
export const ThingEdit = () => {
  const modalOpen = store.thing.use.thingModal();
  const id = store.thing.use.id();
  const name = store.thing.use.name();
  const description = store.thing.use.description();
  const type = store.thing.use.type();
  const image = store.thing.use.image();
  const purifyThing = store.thing.use.purifyThing();
  const createThing = store.thing.use.createThing();
  const updateThing = store.thing.use.updateThing();
  const resetThing = store.thing.use.resetThing();
  const addThingFiles = store.thing.use.addThingFiles();
  return (
    <Modal
      title={id ? "New Thing" : `Thing - ${name}`}
      open={!!modalOpen}
      onOk={() => (id ? updateThing() : createThing())}
      onCancel={() => resetThing()}
      okButtonProps={{ disabled: !purifyThing() }}
    >
      <Field.Container>
        <Field.Text label="Name" value={name} onChange={(name) => store.thing.setState({ name })} />
        <Field.Text
          label="Description"
          value={description}
          onChange={(description) => store.thing.setState({ description })}
        />
        {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => store.thing.setState({ type })}>
          {cnst.thingTypes.map((type) => (
            <Select.Option value={type}>{type}</Select.Option>
          ))}
        </Select> */}
        <Field.Img
          label="Image"
          addFiles={addThingFiles}
          file={image}
          onRemove={() => store.thing.setState({ image: null })}
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
