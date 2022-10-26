import { useEffect, useRef } from "react";
import { MicOnIcon, MicOffIcon, MicOffSmallIcon, CamOnIcon, CamOffIcon } from "../..";
import { callRoomStore, types, userStore } from "../../../stores";
import { Socket as Soc } from "socket.io-client";
import styled from "styled-components";

export interface VideoProps {
  peer: types.PeerStream;
  socket: Soc;
}
export const Video = ({ peer, socket }: VideoProps) => {
  const self = userStore.use.self();
  const roomId = callRoomStore.use.callRoom().roomId;
  const removePeer = callRoomStore.use.removePeer();
  const updatePeer = callRoomStore.use.updatePeer();
  const mutePeer = callRoomStore.use.mutePeer();
  const unmutePeer = callRoomStore.use.unmutePeer();
  const blindPeer = callRoomStore.use.blindPeer();
  const openPeer = callRoomStore.use.openPeer();
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const remoteTrack = useRef<MediaStream | null>(null);

  if (!self) return <></>;
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

  const enter = () => {
    peer.call.peer.on("signal", (data) => {
      const signal = { socketId: peer.socketId, desc: data, roomId, nickName: self.nickname, userId: self.id };
      socket.emit("signal", signal);
    });
    peer.call.peer.on("stream", (stream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = stream;
      }
    });
    peer.call.peer.on("data", (data) => {
      //? transfer Uint8Array to string and parse json
      const newData = JSON.parse(new TextDecoder().decode(data));
      updatePeer({ ...peer, ...newData });
    });
    peer.call.peer.on("track", (track, stream) => {
      remoteTrack.current = stream;
    });
    peer.call.peer.on("error", (err) => console.log(err));
  };

  const toggleMic = () => {
    if (!remoteTrack.current) return;
    if (!peer.muted) {
      if (remoteTrack.current.getAudioTracks().length > 0)
        remoteTrack.current.getAudioTracks().forEach((track) => (track.enabled = false));
      mutePeer(peer.id);
    } else {
      if (remoteTrack.current.getAudioTracks().length > 0)
        remoteTrack.current.getAudioTracks().forEach((track) => (track.enabled = true));
      unmutePeer(peer.id);
    }
  };
  const toggleCam = () => {
    if (!remoteTrack.current) return;
    if (!peer.blind) {
      if (remoteTrack.current.getVideoTracks().length > 0)
        remoteTrack.current.getVideoTracks().forEach((track) => (track.enabled = false));
      blindPeer(peer.id);
    } else {
      if (remoteTrack.current.getVideoTracks().length > 0)
        remoteTrack.current.getVideoTracks().forEach((track) => (track.enabled = true));
      openPeer(peer.id);
    }
  };
  return (
    <Container>
      <VideoBox>
        <NameTag>
          <div style={{ visibility: !peer.mic ? "visible" : "hidden" }}>
            <MicOffSmallIcon />
          </div>
          {peer.nickName}
        </NameTag>
        <BackLight color={peer.isTalk ? "#9ACD32" : "transparent"} />
        {(!peer.cam || peer.blind) && <Bilind />}
        <video className="Video" autoPlay muted={peer.muted} ref={remoteVideo} />
        <Control>
          <IconButton onClick={toggleMic}>{!peer.muted ? <MicOnIcon /> : <MicOffIcon />}</IconButton>
          <IconButton onClick={toggleCam}>{!peer.blind ? <CamOnIcon /> : <CamOffIcon />}</IconButton>
        </Control>
      </VideoBox>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
`;
const VideoBox = styled.div`
  width: 200px;
  height: 130px;

  position: relative;
  border-radius: 10px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  .Video {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    border-radius: 10px;
    z-index: 2;
    -webkit-transform: rotateY(180deg); /* Safari and Chrome */
    transform: rotateY(180deg);
    -moz-transform: rotateY(180deg); /* Firefox */
  }
`;

const BackLight = styled.div`
  position: absolute;
  width: 105%;
  height: 105%;
  border-radius: 10px;
  z-index: 1;
  background-color: ${(props) => props.color};
`;

const Bilind = styled.div`
  position: absolute;
  align-self: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: #3c3c3c;
  z-index: 3;
`;

const NameTag = styled.div`
  position: absolute;
  display: flex;
  padding-left: 4px;
  padding-right: 12px;
  padding-top: 3px;
  padding-bottom: 3px;
  z-index: 4;
  left: 10px;
  top: 10px;
  font-size: 13px;
  justify-items: center;
  align-items: center;
  color: white;
  border-radius: 10px;
  background-color: rgba(178, 178, 178, 0.5);
`;

const Control = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0%;
  z-index: 3;
  transform: translate(-50%, 0);
`;

const IconButton = styled.button`
  background: transparent;
  border-color: transparent;
`;
