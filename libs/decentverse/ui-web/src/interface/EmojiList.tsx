import React, { useEffect } from "react";
import { store, gql } from "@decentverse/data-access";
import styled, { keyframes } from "styled-components";
import { WindowHeader } from "@shared/ui-web";
import { Row, Col } from "antd";

export const EmojiList = () => {
  const isShowEmojiSelecter = store.emoji.use.isShowEmojiSelecter();
  const emojiList = store.emoji.use.emojiList();

  useEffect(() => {
    store.emoji.do.initEmoji();
  }, []);

  if (!isShowEmojiSelecter) return null;

  return (
    <StyledEmojiList>
      <WindowHeader title="Emoji" type="reduce" close={() => store.emoji.setState({ isShowEmojiSelecter: false })} />
      <div className="list">
        <Row gutter={14}>
          {emojiList.map((emoji, idx) => (
            <Col span={6} key={emoji.id} className="item" onClick={() => store.emoji.do.runEmoji(emoji)}>
              {<img alt="emoji" src={emoji.file.url} />}
            </Col>
          ))}
        </Row>
      </div>
    </StyledEmojiList>
  );
};

const emojiAni = keyframes`
  0% {
    transform: scale(0, 0);
    width:0px;
    opacity: 0.4;
  }
  100% {
    transform: scale(1, 1);
    width: 282px;
    opacity: 1;
  }
`;

const emojiMobileAni = keyframes`
  0% {
    transform: scale(0, 0);
    opacity: 0.4;
  }
  100% {
    transform: scale(1, 1);
    opacity: 1;
  }
`;

const StyledEmojiList = styled.div`
  width: 282px;
  border-radius: 10px;
  border: 3px solid #000;
  position: relative;
  transform-origin: left bottom;
  animation: ${emojiAni} 0.3s ease-in-out forwards;
  overflow: hidden;

  @media screen and (max-width: 800px) {
    position: absolute;
    bottom: 81px;
    left: 21px;
    animation: ${emojiMobileAni} 0.3s ease-in-out forwards;
  }

  .list {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(20px);

    position: relative;
    height: 282px;
    padding: 14px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #aaa;
    }
  }

  img {
    width: 100%;
  }
`;
