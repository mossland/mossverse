import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { store, gql } from "@decentverse/data-access";
import { Field, Img } from "@shared/ui-web";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Emojis = () => {
  const init = store.emoji.use.initEmoji();
  const emojis = store.emoji.use.emojiList();
  const emojiModal = store.emoji.use.emojiModal();
  const newEmoji = store.emoji.use.newEmoji();
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Emojis</h2>
        <Button onClick={newEmoji} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={emojis}
        renderItem={(emoji) => <Emoji key={emoji.id} emoji={emoji} />}
      ></List>
      <EmojiEdit />
    </div>
  );
};

interface EmojiProps {
  emoji: gql.Emoji;
}
export const Emoji = React.memo(({ emoji }: EmojiProps) => {
  const editEmoji = store.emoji.use.editEmoji();
  const removeEmoji = store.emoji.use.removeEmoji();
  return (
    <Card
      hoverable
      cover={<img alt="file" src={emoji.file.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => editEmoji(emoji)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => removeEmoji(emoji.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={emoji.name} />
    </Card>
  );
});
export const EmojiEdit = () => {
  const addEmojiFiles = store.emoji.use.addEmojiFiles();
  const emojiModal = store.emoji.use.emojiModal();
  const id = store.emoji.use.id();
  const name = store.emoji.use.name();
  const file = store.emoji.use.file();
  const purifyEmoji = store.emoji.use.purifyEmoji();
  const createEmoji = store.emoji.use.createEmoji();
  const updateEmoji = store.emoji.use.updateEmoji();
  const resetEmoji = store.emoji.use.resetEmoji();
  return (
    <Modal
      title="New Emoji"
      open={!!emojiModal}
      onOk={() => (id ? updateEmoji() : createEmoji())}
      onCancel={() => resetEmoji()}
      okButtonProps={{ disabled: !purifyEmoji() }}
    >
      <Field.Container>
        <Field.Text label="Name" value={name} onChange={(name) => store.emoji.setState({ name })} />
        <Field.Img
          label="File"
          addFiles={addEmojiFiles}
          file={file}
          onRemove={() => store.emoji.setState({ file: null })}
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
