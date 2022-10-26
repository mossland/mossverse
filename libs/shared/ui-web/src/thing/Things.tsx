import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { thingStore, types } from "@shared/data-access";
import { Field, Img } from "../index";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { cnst, Utils } from "@shared/util";

export const Things = () => {
  const init = thingStore.use.init();
  const things = thingStore.use.things();
  const modalOpen = thingStore.use.modalOpen();
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Things</h2>
        <Button onClick={() => thingStore.setState({ ...types.defaultThing, modalOpen: true })} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={things}
        renderItem={(thing) => <Thing key={thing.id} thing={thing} />}
      ></List>
      <ThingEdit />
    </div>
  );
};

interface ThingProps {
  thing: types.Thing;
}
export const Thing = React.memo(({ thing }: ThingProps) => {
  const remove = thingStore.use.remove();
  return (
    <Card
      hoverable
      cover={<img alt="file" src={thing.image.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => thingStore.setState({ ...thing, modalOpen: true })} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => remove(thing.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={thing.name} />
    </Card>
  );
});
export const ThingEdit = () => {
  const modalOpen = thingStore.use.modalOpen();
  const id = thingStore.use.id();
  const name = thingStore.use.name();
  const description = thingStore.use.description();
  const type = thingStore.use.type();
  const image = thingStore.use.image();
  const purify = thingStore.use.purify();
  const create = thingStore.use.create();
  const update = thingStore.use.update();
  const addThingFiles = thingStore.use.addThingFiles();
  return (
    <Modal
      title={id ? "New Thing" : `Thing - ${name}`}
      open={modalOpen}
      onOk={() => (id ? update() : create())}
      onCancel={() => thingStore.setState({ modalOpen: !modalOpen })}
      okButtonProps={{ disabled: !purify() }}
    >
      <Field.Container>
        <Field.Text label="Name" value={name} onChange={(name) => thingStore.setState({ name })} />
        <Field.Text
          label="Description"
          value={description}
          onChange={(description) => thingStore.setState({ description })}
        />
        {/* <Select value={type} style={{ width: "100%" }} onChange={(type) => thingStore.setState({ type })}>
          {cnst.thingTypes.map((type) => (
            <Select.Option value={type}>{type}</Select.Option>
          ))}
        </Select> */}
        <Field.Img
          label="Image"
          onChange={(fileList) => addThingFiles(fileList, "bottom")}
          value={image}
          onRemove={() => thingStore.setState({ image: null })}
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
