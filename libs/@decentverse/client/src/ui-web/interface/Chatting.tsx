import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { types, userStore, worldStore, gossipStore, gameStore } from "../../stores";
import { Button, Input } from "antd";
import { isMobile } from "react-device-detect";
import { SendIcon } from "..";
import styled from "styled-components";
import { EmojiSelecter } from "./";
import { darken } from "polished";
import { TextSendIcon } from "@shared/ui-web";

export interface ChattingProps {
  socket: Soc;
}

export const Chatting = ({ socket }: ChattingProps) => {
  const self = userStore.use.self();
  const receiveChat = gossipStore.use.receiveChat();
  useEffect(() => {
    if (!self) return;
    socket.on("chat:public", (chat: types.Chat) => {
      if (chat.from === self.id) return;
      receiveChat("public", chat);
    });
    return () => {
      socket.off("chat:public");
    };
  }, []);
  if (!self) return <></>;
  return (
    <ChattingContainer>
      <ChatInput socket={socket} />
    </ChattingContainer>
  );
  // return <>{isMobile ? <ChatInputMobile socket={socket} /> : <ChatInput socket={socket} />}</>;
};

const ChattingContainer = styled.div`
  width: 800px;
  @media screen and (max-width: 800px) {
    width: 88%;
    transform: translate(-6%, 0);
  }
`;

export interface ChatProps {
  chat: types.Chat;
}

export const Chat = ({ chat }: ChatProps) => {
  return (
    <div style={{ color: "white" }}>
      {chat.fromName}: {chat.text}
    </div>
  );
};

export const ChatInput = ({ socket }: ChattingProps) => {
  const self = userStore.use.self();
  const chatInput = gossipStore.use.chatInput();
  const sendChat = gossipStore.use.sendChat();
  const speakChat = (chatText: string) => gossipStore.setState({ chatText });
  const onChangeChatText = (chatInput: string) => gossipStore.setState({ chatInput });
  const clearChatInput = () => gossipStore.setState({ chatInput: "" });
  const lockKey = gameStore.use.lockKey();
  const keyPress = async (e: any) => e.key === "Enter" && !e.shiftKey && onSubmit();
  const timeout = useRef<NodeJS.Timeout>();
  if (!self) return <></>;

  const onSubmit = () => {
    if (timeout.current) clearInterval(timeout.current);
    const chat = {
      from: self.id,
      fromName: self.id,
      text: chatInput,
      at: new Date(),
    };
    socket.emit("chat", "public", chat);
    sendChat("public", chatInput);
    speakChat(chatInput);
    clearChatInput();
    timeout.current = setTimeout(() => speakChat(""), 3000);
  };

  return (
    <ChatInputContainer>
      <EmojiSelecter />
      <div className="chat-wrapper">
        <div className="chat-input-wrapper">
          <Input
            onFocus={() => !isMobile && lockKey(true)}
            onBlur={() => !isMobile && lockKey(false)}
            // onMouseOut={() => !isMobile && lockKey(false)}
            value={chatInput}
            onChange={(e) => onChangeChatText(e.target.value)}
            onKeyPress={keyPress}
            placeholder="type..."
          />
        </div>
        <div className="chat-button" onClick={onSubmit}>
          <div className="only-pc">Enter</div>
          <div className="only-mobile">
            <TextSendIcon />
          </div>
        </div>
      </div>
    </ChatInputContainer>
  );
  {
    /* <Button style={{ width: 50, backgroundColor: "red" }} onClick={onSubmit} /> */
  }
};

const ChatInputContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-end;
  margin: 20px 20px;
  gap: 10px;
  .chat-wrapper {
    display: flex;
    width: 100%;
  }

  .chat-input-wrapper {
    flex: 1;
    background-color: white;
    border-radius: 10px 0 0 10px;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    border: 3px solid #000;
    border-right-width: 2px;

    input {
      color: black;
      font-size: 22px;
      width: 100%;
      background-color: transparent;
      border-width: 0;
      border-radius: 10px;
      &::placeholder {
        color: black;
        opacity: 1;
      }
    }
  }

  .chat-button {
    font-size: 22px;
    padding: 6px 71px;
    height: 50px;
    background-color: #eee;
    border-radius: 0 10px 10px 0;
    border: 3px solid #000;
    border-left-width: 0px;
    cursor: pointer;
    transition: 0.5s;
    &:hover,
    &:active {
      background-color: ${darken(0.2, "#eee")};
    }

    svg {
      margin: 7px 6px;
    }

    @media screen and (max-width: 800px) {
      padding: 6px 7px;
    }
  }
`;

// export const ChatInputMobile = ({ socket }: ChattingProps) => {
//   const self = userStore.use.self();
//   const screen = gameStore.use.screen();
//   const chatInput = gossipStore.use.chatInput();
//   const speakChat = (chatText: string) => gossipStore.setState({ chatText });
//   const sendChat = gossipStore.use.sendChat();
//   const lockKey = gameStore.use.lockKey();
//   const onChangeChatText = (chatInput: string) => gossipStore.setState({ chatInput });
//   const keyPress = async (e: any) => e.key === "Enter" && !e.shiftKey && onSubmit();
//   const timeout = useRef<NodeJS.Timeout>();
//   if (!self) return <></>;
//   const onSubmit = () => {
//     if (timeout.current) clearInterval(timeout.current);
//     const chat = {
//       from: self.id,
//       fromName: self.id,
//       text: chatInput,
//       at: new Date(),
//     };
//     socket.emit("chat", "public", chat);
//     sendChat("public", chatInput);
//     speakChat(chatInput);
//     timeout.current = setTimeout(() => speakChat(""), 3000);
//   };
//   return (
//     <div style={{ width: "100%", marginBottom: 10, borderRadius: 20 }}>
//       <div
//         style={{
//           display: "flex",
//           width: "100%",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingLeft: 20,
//           paddingRight: 20,
//           marginBottom: 10,
//         }}
//       >
//         <EmojiSelecter />

//         <div style={{ backgroundColor: "#4b46467f", width: "80%", height: "100%", borderRadius: 40 }}>
//           <Input
//             onFocus={() => !isMobile && lockKey(true)}
//             onBlur={() => !isMobile && lockKey(false)}
//             onMouseOut={() => !isMobile && lockKey(false)}
//             style={{
//               fontSize: 18,
//               backgroundColor: "transparent",
//               color: "white",
//               width: "100%",
//               borderRadius: 20,
//               borderColor: "transparent",
//             }}
//             value={chatInput}
//             onChange={(e) => onChangeChatText(e.target.value)}
//             onKeyDown={keyPress}
//             placeholder="type..."
//           />
//         </div>
//         <SendButton
//           width={screen.size[0] / 8}
//           height={screen.size[0] / 8}
//           borderRadius={screen.size[0] / 8}
//           onClick={onSubmit}
//         >
//           <SendIcon width={screen.size[0] / 20} height={screen.size[0] / 20} />
//         </SendButton>
//       </div>
//     </div>
//   );
// };

// const SendButton = styled("button")<{ width?: number; height?: number; borderRadius?: number }>`
//   width: ${(props) => props.width ?? 100}px;
//   height: ${(props) => props.width ?? 100}px;
//   border-radius: ${(props) => props.width ?? 30}px;
//   background-color: white;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-left: 10px;
//   :active {
//     opacity: 0.7;
//   }
// `;
