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
  const emojis = store.emoji.use.emojiList();
  const emojiModal = store.emoji.use.emojiModal();
  useEffect(() => {
    store.emoji.do.initEmoji();
  }, []);
  if (emojis === "loading") return <></>;
  return (
    <div>
      <Header>
        <h2>Emojis</h2>
        <Button onClick={() => store.emoji.do.newEmoji()} icon={<PlusOutlined />}>
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
  return (
    <Card
      hoverable
      cover={<img alt="file" src={emoji.file.url} />}
      actions={[
        <EditOutlined key="edit" onClick={() => store.emoji.do.editEmoji(emoji)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => store.emoji.do.removeEmoji(emoji.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={emoji.name} />
    </Card>
  );
});
export const EmojiEdit = () => {
  const emojiModal = store.emoji.use.emojiModal();
  const emojiForm = store.emoji.use.emojiForm();
  return (
    <Modal
      title="New Emoji"
      open={!!emojiModal}
      onOk={() => (emojiForm.id ? store.emoji.do.updateEmoji() : store.emoji.do.createEmoji())}
      onCancel={() => store.emoji.do.resetEmoji()}
      okButtonProps={{ disabled: !store.emoji.do.purifyEmoji() }}
    >
      <Field.Container>
        <Field.Text label="Name" value={emojiForm.name} onChange={store.emoji.do.setNameOnEmoji} />
        <Field.Img
          label="File"
          addFiles={store.emoji.do.addEmojiFiles}
          file={emojiForm.file}
          onRemove={() => store.emoji.do.setFileOnEmoji(null)}
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
