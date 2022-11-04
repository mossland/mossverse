import { useEffect } from "react";
import { Socket as Soc } from "socket.io-client";
import { store, gql } from "@decentverse/data-access";
import { Call } from "./Call";
import styled from "styled-components";
import { InitForm, PeerStream } from "@shared/util-client";
export interface CallBoxProps {
  localStream: MediaStream;
  screenStream?: MediaStream;
  socket: Soc;
  roomId: string;
}

export const CallBox = ({ localStream, screenStream, socket, roomId }: CallBoxProps) => {
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

  return (
    <CallBoxContainer>
      {peers.map((peer: PeerStream) => (
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
