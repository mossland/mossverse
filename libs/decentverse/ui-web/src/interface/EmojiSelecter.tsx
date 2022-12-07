import React, { useEffect } from "react";
import { store, gql } from "@decentverse/data-access";
import styled, { keyframes } from "styled-components";
import { darken } from "polished";
import { SmileOutlined } from "@ant-design/icons";
import { WindowHeader } from "@shared/ui-web";
import { Row, Col } from "antd";
import { EmojiList } from "./";

export const EmojiSelecter = () => {
  const isShowEmojiSelecter = store.emoji.use.isShowEmojiSelecter();
  const emojiList = store.emoji.use.emojiList();

  useEffect(() => {
    store.emoji.do.initEmoji();
  }, []);

  return (
    <div>
      <div className="only-pc" style={{ display: "relative" }}>
        {!isShowEmojiSelecter ? (
          <EmojiButton onClick={() => store.emoji.setState({ isShowEmojiSelecter: true })}>
            <SmileOutlined />
          </EmojiButton>
        ) : (
          <EmojiList />
        )}
      </div>
      <div className="only-mobile">
        <EmojiButton onClick={() => store.emoji.setState({ isShowEmojiSelecter: !isShowEmojiSelecter })}>
          <SmileOutlined />
        </EmojiButton>
        <EmojiList />
      </div>
    </div>
  );
};

const EmojiButton = styled.div`
  border: 3px solid #000;
  background-color: white;
  border-radius: 10px;
  padding: 9px 11px 5px 11px;
  cursor: pointer;
  transition: 0.5s;

  svg {
    margin: 0;
    font-size: 26px;
  }
  &:hover {
    background-color: ${darken(0.2, "white")};
  }
`;
