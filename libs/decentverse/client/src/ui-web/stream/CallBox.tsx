import { useEffect } from "react";
import { Socket as Soc } from "socket.io-client";
import { types, userStore, callRoomStore } from "../../stores";
import { Call } from "./Call";
import styled from "styled-components";
export interface CallBoxProps {
  localStream: MediaStream;
  screenStream?: MediaStream;
  socket: Soc;
  roomId: string;
}

export const CallBox = ({ localStream, screenStream, socket, roomId }: CallBoxProps) => {
  const self = userStore.use.self();
  if (!self) return <></>;
  const peers = callRoomStore.use.peers();
  const addPeer = callRoomStore.use.addPeer();

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

  return (
    <CallBoxContainer>
      {peers.map((peer, idx) => (
        <Call key={peer.id} peer={peer} socket={socket} />
      ))}
    </CallBoxContainer>
  );
};

const CallBoxContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  /* overflow-y: scroll; */
`;
