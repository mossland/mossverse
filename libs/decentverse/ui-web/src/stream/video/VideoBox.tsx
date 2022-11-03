import { useEffect } from "react";
import { Socket as Soc } from "socket.io-client";
import { store, gql } from "@decentverse/data-access";
import { Video } from "./Video";
import styled from "styled-components";
import { InitForm } from "@shared/util-client";

export interface VideoBoxProps {
  localStream: MediaStream;
  screenStream?: MediaStream;
  socket: Soc;
  roomId: string;
}

export const VideoBox = ({ localStream, screenStream, socket, roomId }: VideoBoxProps) => {
  const self = store.user.use.self();
  const peers = store.callRoom.use.peers();
  const addPeer = store.callRoom.use.addPeer();

  useEffect(() => {
    if (!self) return;
    socket.on("init", (clientId: string, init: InitForm) => {
      if (init.userId === self.id) return;
      addPeer(clientId, false, init, localStream, screenStream);
      socket.emit("receive", { socketId: clientId, roomId, userId: self.id, nickName: self.nickname });
    });
    socket.on("receive", (clientId: string, init: InitForm) => {
      addPeer(clientId, true, init, localStream, screenStream);
    });
    return () => {
      socket.off("init");
      socket.off("receive");
    };
    // socket.on("full", () => setFull(true));
  }, []);
  if (!self) return <></>;
  if (!peers.length) return <></>;

  return (
    <VideoBoxContainer>
      {/* <TotalUserIconBox>
        <div className="icon">{<PeoplesIcon />}</div>
        <div className="text">{peers.length}</div>
      </TotalUserIconBox> */}
      <div className="inner-container">
        {peers.map((peer, idx) => (
          <Video key={peer.id} peer={peer} socket={socket} />
        ))}
      </div>
    </VideoBoxContainer>
  );
};

const VideoBoxContainer = styled.div`
  position: absolute;
  overflow-y: scroll;
  overflow-x: hidden;
  /* overflow-y: scroll; */
  height: 100%;
  right: 0%;
  top: 2%;
  /* border-width: 10px; */
  /* z-index: 3; */
  display: inline;
  justify-content: center;
  align-content: center;
  * {
    -ms-overflow-style: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  /* border-width: 10px; */
  /* padding: 30px; */
  /* padding-top: 60px; */
  padding: 60px 10px 10px 10px;
  border-radius: 10px;
  /* background-color: #888888; */

  @media screen and (max-width: 800px) {
    padding: 50px 0px 0px 0px;
    background-color: transparent;
    .inner-container {
      transform: scale(0.7, 0.7);
    }
  }
`;

const TotalUserIconBox = styled.div`
  background-color: #61a6df;
  width: auto;
  height: auto;
  min-width: 80px;
  max-width: 80px;
  /* line-height: 10px; */
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  color: white;
  .icon {
    margin-right: 5px;
  }
  .text {
    margin-left: 5px;
  }
`;
