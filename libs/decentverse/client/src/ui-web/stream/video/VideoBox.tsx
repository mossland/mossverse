import { useEffect } from "react";
import { Socket as Soc } from "socket.io-client";
import { callRoomStore, types, userStore } from "../../../stores";
import { Video } from "./Video";
import styled from "styled-components";

export interface VideoBoxProps {
  localStream: MediaStream;
  screenStream?: MediaStream;
  socket: Soc;
  roomId: string;
}

export const VideoBox = ({ localStream, screenStream, socket, roomId }: VideoBoxProps) => {
  const self = userStore.use.self();
  const peers = callRoomStore.use.peers();
  const addPeer = callRoomStore.use.addPeer();
  if (!self) return <></>;
  useEffect(() => {
    socket.on("init", (clientId: string, init: types.InitForm) => {
      if (init.userId === self.id) return;
      addPeer(clientId, false, init, localStream, screenStream);
      socket.emit("receive", { socketId: clientId, roomId, userId: self.id, nickName: self.nickname });
    });
    socket.on("receive", (clientId: string, init: types.InitForm) => {
      addPeer(clientId, true, init, localStream, screenStream);
    });
    return () => {
      socket.off("init");
      socket.off("receive");
    };
    // socket.on("full", () => setFull(true));
  }, []);

  if (!peers.length) return null;

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
