import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { characterStore, mapStore, types } from "../../stores";
import { Field, Img } from "@shared/ui-web";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Characters = () => {
  const init = characterStore.use.init();
  const characters = characterStore.use.characters();
  const modalOpen = characterStore.use.modalOpen();
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Characters</h2>
        <Button
          onClick={() => characterStore.setState({ ...types.defaultCharacter, modalOpen: true })}
          icon={<PlusOutlined />}
        >
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={characters}
        renderItem={(character) => <Character key={character.id} character={character} />}
      ></List>
      <CharacterEdit />
    </div>
  );
};

interface CharacterProps {
  character: types.Character;
}
export const Character = React.memo(({ character }: CharacterProps) => {
  const remove = characterStore.use.remove();
  return (
    <Card
      hoverable
      cover={<img alt="file" src={character.file.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => characterStore.setState({ ...character, modalOpen: true })} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => remove(character.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={character.name} />
    </Card>
  );
});
export const CharacterEdit = () => {
  const modalOpen = characterStore.use.modalOpen();
  const id = characterStore.use.id();
  const name = characterStore.use.name();
  const file = characterStore.use.file();
  const tileSize = characterStore.use.tileSize();
  const totalSize = characterStore.use.totalSize();
  const size = characterStore.use.size();
  const left = characterStore.use.left();
  const right = characterStore.use.right();
  const up = characterStore.use.up();
  const down = characterStore.use.down();
  // const thing = characterStore.use.thing();
  // const token = characterStore.use.token();
  const purify = characterStore.use.purify();
  const create = characterStore.use.create();
  const update = characterStore.use.update();
  const addCharacterFiles = characterStore.use.addCharacterFiles();
  return (
    <Modal
      title="New Character"
      open={modalOpen}
      onOk={() => (id ? update() : create())}
      onCancel={() => characterStore.setState({ modalOpen: !modalOpen })}
      okButtonProps={{ disabled: !purify() }}
      width={1300}
    >
      <Field.Container>
        <Row gutter={10}>
          <Col span={8}>
            <Field.Text label="Name" value={name} onChange={(name) => characterStore.setState({ name })} />
            <Field.Img
              label="File"
              onChange={(fileList) => addCharacterFiles(fileList, id)}
              value={file}
              onRemove={() => characterStore.setState({ file: null })}
            />
            <Field.DoubleNumber
              label="TotalSize"
              onChange={(totalSize) => characterStore.setState({ totalSize })}
              value={totalSize}
              disabled={true}
            />
            <Field.DoubleNumber
              label="TileSize"
              onChange={(tileSize) => characterStore.setState({ tileSize })}
              value={tileSize}
            />
            <Field.DoubleNumber label="Size" onChange={(size) => characterStore.setState({ size })} value={size} />
          </Col>
          <Col span={8}>
            {right ? (
              <Sprite direction="right" />
            ) : (
              <Button onClick={() => characterStore.setState({ right: types.defaultCharacter.right })}>
                Create-right
              </Button>
            )}
            {left ? (
              <Sprite direction="left" />
            ) : (
              <Button onClick={() => characterStore.setState({ left: types.defaultCharacter.left })}>
                Create-left
              </Button>
            )}
          </Col>
          <Col span={8}>
            {up ? (
              <Sprite direction="up" />
            ) : (
              <Button onClick={() => characterStore.setState({ up: types.defaultCharacter.up })}>Create-up</Button>
            )}
            {down ? (
              <Sprite direction="down" />
            ) : (
              <Button onClick={() => characterStore.setState({ down: types.defaultCharacter.down })}>
                Create-down
              </Button>
            )}
          </Col>
        </Row>
      </Field.Container>
    </Modal>
  );
};
interface SpriteProps {
  direction: "up" | "down" | "right" | "left";
}
export const Sprite = ({ direction }: SpriteProps) => {
  return (
    <>
      idle
      <SpriteDef direction={direction} type="idle" />
      <br />
      walk
      <SpriteDef direction={direction} type="walk" />
      <Button onClick={() => characterStore.setState(Utils.update(direction, null))}>Remove-{direction}</Button>
      <br />
    </>
  );
};
interface SpriteDefProps {
  type: "idle" | "walk";
  direction: "up" | "down" | "right" | "left";
}
export const SpriteDef = ({ type, direction }: SpriteDefProps) => {
  const sprite = characterStore.use[direction]();
  if (!sprite) return <></>;
  return (
    <>
      <Field.Number
        label="row"
        value={sprite[type].row}
        onChange={(row) =>
          characterStore.setState(
            Utils.update(direction, { ...sprite, ...Utils.update(type, { ...sprite[type], row }) })
          )
        }
      />
      <Field.Number
        label="column"
        value={sprite[type].column}
        onChange={(column) =>
          characterStore.setState(
            Utils.update(direction, { ...sprite, ...Utils.update(type, { ...sprite[type], column }) })
          )
        }
      />
      <Field.Number
        label="duration"
        value={sprite[type].duration}
        onChange={(duration) =>
          characterStore.setState(
            Utils.update(direction, { ...sprite, ...Utils.update(type, { ...sprite[type], duration }) })
          )
        }
      />
    </>
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
