import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { store, gql } from "@decentverse/data-access";
import { Field, Img } from "@shared/ui-web";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Characters = () => {
  const init = store.character.use.initCharacter();
  const characterList = store.character.use.characterList();
  const characterModal = store.character.use.characterModal();
  const newCharacter = store.character.use.newCharacter();
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Characters</h2>
        <Button onClick={newCharacter} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={characterList}
        renderItem={(character) => <Character key={character.id} character={character} />}
      ></List>
      <CharacterEdit />
    </div>
  );
};

interface CharacterProps {
  character: gql.Character;
}
export const Character = React.memo(({ character }: CharacterProps) => {
  const editCharacter = store.character.use.editCharacter();
  const removeCharacter = store.character.use.removeCharacter();
  return (
    <Card
      hoverable
      cover={<img alt="file" src={character.file.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => editCharacter(character)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => removeCharacter(character.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={character.name} />
    </Card>
  );
});
export const CharacterEdit = () => {
  const characterModal = store.character.use.characterModal();
  const id = store.character.use.id();
  const name = store.character.use.name();
  const file = store.character.use.file();
  const tileSize = store.character.use.tileSize();
  const totalSize = store.character.use.totalSize();
  const size = store.character.use.size();
  const left = store.character.use.left();
  const right = store.character.use.right();
  const up = store.character.use.up();
  const down = store.character.use.down();
  // const thing = store.character.use.thing();
  // const token = store.character.use.token();
  const purifyCharacter = store.character.use.purifyCharacter();
  const createCharacter = store.character.use.createCharacter();
  const updateCharacter = store.character.use.updateCharacter();
  const addCharacterFiles = store.character.use.addCharacterFiles();
  const resetCharacter = store.character.use.resetCharacter();
  return (
    <Modal
      title="New Character"
      open={!!characterModal}
      onOk={() => (id ? updateCharacter() : createCharacter())}
      onCancel={() => resetCharacter()}
      okButtonProps={{ disabled: !purifyCharacter() }}
      width={1300}
    >
      <Field.Container>
        <Row gutter={10}>
          <Col span={8}>
            <Field.Text label="Name" value={name} onChange={(name) => store.character.setState({ name })} />
            <Field.Img
              label="File"
              addFiles={addCharacterFiles}
              file={file}
              onRemove={() => store.character.setState({ file: null })}
            />
            <Field.DoubleNumber
              label="TotalSize"
              onChange={(totalSize) => store.character.setState({ totalSize })}
              value={totalSize}
              disabled={true}
            />
            <Field.DoubleNumber
              label="TileSize"
              onChange={(tileSize) => store.character.setState({ tileSize })}
              value={tileSize}
            />
            <Field.DoubleNumber label="Size" onChange={(size) => store.character.setState({ size })} value={size} />
          </Col>
          <Col span={8}>
            {right ? (
              <Sprite direction="right" />
            ) : (
              <Button onClick={() => store.character.setState({ right: gql.defaultCharacter.right })}>
                Create-right
              </Button>
            )}
            {left ? (
              <Sprite direction="left" />
            ) : (
              <Button onClick={() => store.character.setState({ left: gql.defaultCharacter.left })}>Create-left</Button>
            )}
          </Col>
          <Col span={8}>
            {up ? (
              <Sprite direction="up" />
            ) : (
              <Button onClick={() => store.character.setState({ up: gql.defaultCharacter.up })}>Create-up</Button>
            )}
            {down ? (
              <Sprite direction="down" />
            ) : (
              <Button onClick={() => store.character.setState({ down: gql.defaultCharacter.down })}>Create-down</Button>
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
      <Button onClick={() => store.character.setState(Utils.update(direction, null))}>Remove-{direction}</Button>
      <br />
    </>
  );
};
interface SpriteDefProps {
  type: "idle" | "walk";
  direction: "up" | "down" | "right" | "left";
}
export const SpriteDef = ({ type, direction }: SpriteDefProps) => {
  const sprite = store.character.use[direction]();
  if (!sprite) return <></>;
  return (
    <>
      <Field.Number
        label="row"
        value={sprite[type].row}
        onChange={(row) =>
          store.character.setState(
            Utils.update(direction, { ...sprite, ...Utils.update(type, { ...sprite[type], row }) })
          )
        }
      />
      <Field.Number
        label="column"
        value={sprite[type].column}
        onChange={(column) =>
          store.character.setState(
            Utils.update(direction, { ...sprite, ...Utils.update(type, { ...sprite[type], column }) })
          )
        }
      />
      <Field.Number
        label="duration"
        value={sprite[type].duration}
        onChange={(duration) =>
          store.character.setState(
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
