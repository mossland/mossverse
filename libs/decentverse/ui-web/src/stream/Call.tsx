import { useEffect, useRef } from "react";
import { store, gql } from "@decentverse/data-access";
import { Socket as Soc } from "socket.io-client";
import styled from "styled-components";
import { PeerStream } from "@shared/util-client";

export interface CallProps {
  peer: PeerStream;
  socket: Soc;
}
export const Call = ({ peer, socket }: CallProps) => {
  const self = store.user.use.self();
  const roomId = store.callRoom.use.callRoom().roomId;
  const removePeer = store.callRoom.use.removePeer();
  const updatePeer = store.callRoom.use.updatePeer();
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const remoteTrack = useRef<MediaStream | null>(null);

  useEffect(() => {
    enter();
    socket.on(`desc:${peer.id}`, (data) => {
      if (peer.call.peer.connected) return;
      peer.call.connect(data.desc);
    });
    socket.on(`disconnected:${peer.id}`, () => {
      peer.call.peer.destroy();
      removePeer(peer.id);
    });
    return () => {
      const tracks = remoteTrack.current?.getTracks();
      tracks?.forEach((track) => track.stop());
      socket.off(`desc:${peer.id}`);
      socket.off(`disconnected:${peer.id}`);
    };
  }, []);
  if (!self) return <></>;

  const enter = () => {
    peer.call.peer.on("signal", (data: any) => {
      const signal = { socketId: peer.socketId, desc: data, roomId, nickName: self.nickname, userId: self.id };
      socket.emit("signal", signal);
    });
    peer.call.peer.on("stream", (stream: any) => {
      if (remoteVideo.current) remoteVideo.current.srcObject = stream;
    });
    peer.call.peer.on("data", (data: any) => {
      //? transfer Uint8Array to string and parse json
      const newData = JSON.parse(new TextDecoder().decode(data));
      updatePeer({ ...peer, ...newData });
    });
    peer.call.peer.on("track", (track: any, stream: any) => {
      remoteTrack.current = stream;
    });
    peer.call.peer.on("error", (err: any) => console.log(err));
  };

  return (
    <Container>
      <audio className="Video" playsInline autoPlay muted={peer.muted} ref={remoteVideo} />
    </Container>
  );
};

const Container = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
`;
