import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { emojiStore, mapStore, types } from "../../stores";
import { Field, Img } from "@shared/ui-web";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Emojis = () => {
  const init = emojiStore.use.init();
  const emojis = emojiStore.use.emojis();
  const modalOpen = emojiStore.use.modalOpen();
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Emojis</h2>
        <Button onClick={() => emojiStore.setState({ ...types.defaultEmoji, modalOpen: true })} icon={<PlusOutlined />}>
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
  emoji: types.Emoji;
}
export const Emoji = React.memo(({ emoji }: EmojiProps) => {
  const remove = emojiStore.use.remove();
  return (
    <Card
      hoverable
      cover={<img alt="file" src={emoji.file.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => emojiStore.setState({ ...emoji, modalOpen: true })} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => remove(emoji.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={emoji.name} />
    </Card>
  );
});
export const EmojiEdit = () => {
  const addEmojiFiles = emojiStore.use.addEmojiFiles();
  const modalOpen = emojiStore.use.modalOpen();
  const id = emojiStore.use.id();
  const name = emojiStore.use.name();
  const file = emojiStore.use.file();
  const purify = emojiStore.use.purify();
  const create = emojiStore.use.create();
  const update = emojiStore.use.update();
  return (
    <Modal
      title="New Emoji"
      open={modalOpen}
      onOk={() => (id ? update() : create())}
      onCancel={() => emojiStore.setState({ modalOpen: !modalOpen })}
      okButtonProps={{ disabled: !purify() }}
    >
      <Field.Container>
        <Field.Text label="Name" value={name} onChange={(name) => emojiStore.setState({ name })} />
        <Field.Img
          label="File"
          onChange={(fileList) => addEmojiFiles(fileList, id)}
          value={file}
          onRemove={() => emojiStore.setState({ file: null })}
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
