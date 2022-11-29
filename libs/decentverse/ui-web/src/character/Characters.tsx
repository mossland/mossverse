import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { store, gql } from "@decentverse/data-access";
import { Field, Img } from "@shared/ui-web";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";
interface CharactersProps {
  characterSlice: gql.CharacterSlice;
}
export const Characters = ({ characterSlice }: CharactersProps) => {
  const characterList = characterSlice.use.characterList();
  const characterModal = characterSlice.use.characterModal();
  useEffect(() => {
    store.character.do.initCharacter();
  }, []);

  if (characterList === "loading") return <></>;
  return (
    <div>
      <Header>
        <h2>Characters</h2>
        <Button onClick={() => store.character.do.newCharacter()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={characterList as gql.Character[]}
        renderItem={(character) => (
          <Character key={character.id} characterSlice={characterSlice} character={character} />
        )}
      ></List>
      <CharacterEdit characterSlice={characterSlice} />
    </div>
  );
};

interface CharacterProps {
  character: gql.Character;
  characterSlice: gql.CharacterSlice;
}
export const Character = React.memo(({ character, characterSlice }: CharacterProps) => {
  return (
    <Card
      hoverable
      cover={<img alt="file" src={character.file.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => characterSlice.do.editCharacter(character)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => store.character.do.removeCharacter(character.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={character.name} />
    </Card>
  );
});

interface CharacterEditProps {
  characterSlice: gql.CharacterSlice;
}

export const CharacterEdit = ({ characterSlice }: CharacterEditProps) => {
  const characterModal = characterSlice.use.characterModal();
  const characterForm = characterSlice.use.characterForm();
  // const thing = store.character.use.thing();
  // const token = store.character.use.token();
  return (
    <Modal
      title="New Character"
      open={!!characterModal}
      onOk={() => (characterForm.id ? characterSlice.do.updateCharacter() : characterSlice.do.createCharacter())}
      onCancel={() => characterSlice.do.resetCharacter()}
      okButtonProps={{ disabled: !characterSlice.use.purifyCharacter() }}
      width={1300}
    >
      <Field.Container>
        <Row gutter={10}>
          <Col span={8}>
            <Field.Text label="Name" value={characterForm.name} onChange={characterSlice.do.setNameOnCharacter} />
            <Field.Img
              label="File"
              addFiles={characterSlice.do.addCharacterFiles}
              file={characterForm.file}
              onRemove={() => characterSlice.do.setFileOnCharacter(null)}
            />
            <Field.DoubleNumber
              label="TotalSize"
              onChange={characterSlice.do.setTotalSizeOnCharacter}
              value={characterForm.totalSize}
              disabled={true}
            />
            <Field.DoubleNumber
              label="TileSize"
              onChange={characterSlice.do.setTileSizeOnCharacter}
              value={characterForm.tileSize}
            />
            <Field.DoubleNumber
              label="Size"
              onChange={characterSlice.do.setSizeOnCharacter}
              value={characterForm.size}
            />
          </Col>
          <Col span={8}>
            {characterForm.right ? (
              <Sprite direction="right" />
            ) : (
              <Button onClick={() => characterSlice.do.setRightOnCharacter(gql.defaultCharacter.right)}>
                Create-right
              </Button>
            )}
            {characterForm.left ? (
              <Sprite direction="left" />
            ) : (
              <Button onClick={() => characterSlice.do.setLeftOnCharacter(gql.defaultCharacter.left)}>
                Create-left
              </Button>
            )}
          </Col>
          <Col span={8}>
            {characterForm.up ? (
              <Sprite direction="up" />
            ) : (
              <Button onClick={() => characterSlice.do.setUpOnCharacter(gql.defaultCharacter.up)}>Create-up</Button>
            )}
            {characterForm.down ? (
              <Sprite direction="down" />
            ) : (
              <Button onClick={() => characterSlice.do.setDownOnCharacter(gql.defaultCharacter.down)}>
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
      <Button onClick={() => store.character.use.setState(Utils.update(direction, null))}>Remove-{direction}</Button>
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
