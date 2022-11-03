import { useEffect, useRef } from "react";
import {
  ShareScreenOnIcon,
  ShareScreenOffIcon,
  MicOnIcon,
  MicOffIcon,
  MicOffSmallIcon,
  CamOnIcon,
  CamOffIcon,
} from "../..";
import { Socket as Soc } from "socket.io-client";
import { worldStore, userStore, callRoomStore } from "../../../stores";
import { useInterval } from "../../../hooks";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

export interface MyVideoProps {
  socket: Soc;
  roomId: string;
}

const videoWidth = 240;
const videoHeight = 280;

export const MyVideo = ({ socket, roomId }: MyVideoProps) => {
  // const me = worldStore.use.me();
  const self = userStore.use.self();
  const callRoom = callRoomStore.use.callRoom();
  const peers = callRoomStore.use.peers();
  const videoTrack = callRoomStore.use.videoTrack();
  const audioTrack = callRoomStore.use.audioTrack();
  const setMic = callRoomStore.use.setMic();
  const setCam = callRoomStore.use.setCam();
  const setIsTalk = callRoomStore.use.setIsTalk();
  const clearPeers = callRoomStore.use.clearPeers();
  const toggleScreen = callRoomStore.use.toggleScreen();
  const setLocalStream = callRoomStore.use.setLocalStream();
  const stopAudioAnalysing = callRoomStore.use.stopAudioAnalysing();
  const operateAudioAnalysing = callRoomStore.use.operateAudioAnalysing();
  const localVideo = useRef<HTMLVideoElement>(null);
  const screenVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!self) return;
    getUserMedia().then(() => {
      socket.emit("join", { roomId, userId: self.id, nickName: self.nickname });
    });

    return () => {
      stopAudioAnalysing();
      setIsTalk(false);
      socket.emit("leave");
      peers.map((peer) => peer.call.peer.destroy());
      clearPeers();
    };
  }, []);

  useInterval(() => {
    if (!self) return;
    for (const peer of peers) {
      if (!peer.call.peer.connected) return;
      const callData = {
        id: self.id,
        cam: callRoom.cam,
        mic: callRoom.mic,
        isTalk: callRoom.mic && callRoom.isTalk,
      };
      peer.call.peer.send(JSON.stringify(callData));
    }
  }, 500);
  const getUserMedia = async () => {
    const op: MediaStreamConstraints = {
      video: {
        width: isMobile ? 130 : 200,
        height: isMobile ? 200 : 130,
        facingMode: "user",
        groupId: videoTrack ? videoTrack.id : undefined,
      },

      audio: {
        groupId: audioTrack ? audioTrack.id : undefined,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(op);

    stream.getAudioTracks()[0].enabled = callRoom.mic ? true : false;
    stream.getVideoTracks()[0].enabled = callRoom.cam;

    if (localVideo.current) localVideo.current.srcObject = stream;
    setLocalStream(stream);
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);
    const pcmData = new Float32Array(analyserNode.fftSize);

    const checkVolume = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;

      for (const amplitude of pcmData) {
        sumSquares += amplitude * amplitude;
      }
      if (sumSquares > 0.1) setIsTalk(true);
      else setIsTalk(false);
    };
    operateAudioAnalysing(() => {
      window.requestAnimationFrame(checkVolume);
    });

    return stream;
  };

  const toggleMyCam = async () => {
    const cam = !callRoom.cam;
    setCam(cam);
  };
  const toggleMyMic = async () => {
    const mic = callRoom.mic ? 0 : 100;
    setMic(mic);
  };
  const getDisplay = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    // callRoom.localStream?.addTrack(stream.getTracks()[0]);
    if (screenVideo.current) {
      if (screenVideo.current.srcObject) screenVideo.current.srcObject = null;
      else screenVideo.current.srcObject = stream;
    }
    toggleScreen(stream);
    // if (localScreen.current) localScreen.current.srcObject = stream;
  };
  if (!self) return <></>;

  return (
    <Container>
      <VideoBox>
        <NameTag>
          <div style={{ visibility: !callRoom.mic ? "visible" : "hidden" }}>
            <MicOffSmallIcon />
          </div>
          {self.nickname}
        </NameTag>
        <BackLight color={callRoom.isTalk ? "#9ACD32" : "#000"} />
        {!callRoom.cam && <Bilind />}
        <video autoPlay muted ref={localVideo} playsInline />
        <Control>
          <IconButton onClick={getDisplay}>
            <ShareScreenOffIcon />
          </IconButton>
          <IconButton onClick={toggleMyMic}>{callRoom.mic ? <MicOnIcon /> : <MicOffIcon />}</IconButton>
          <IconButton onClick={toggleMyCam}>{callRoom.cam ? <CamOnIcon /> : <CamOffIcon />}</IconButton>
        </Control>
      </VideoBox>
      <video className="ScreenShare" autoPlay muted ref={screenVideo} />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 10%;
  left: 1%;
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
    border-radius: 6px;
    z-index: 2;
    -webkit-transform: rotateY(180deg); /* Safari and Chrome */
    transform: rotateY(180deg);
    -moz-transform: rotateY(180deg); /* Firefox */
  }
  .ScreenShare {
    position: absolute;
    left: 50%;
  }
  @media screen and (max-width: 800px) {
    transform: scale(0.7, 0.7);
    transform-origin: 0 0;
  }
`;

const Bilind = styled.div`
  position: absolute;
  align-self: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: #888888;
  z-index: 3;
`;

const BackLight = styled.div`
  position: absolute;
  width: 103%;
  height: 103%;
  border-radius: 8px;
  z-index: 1;
  background-color: ${(props) => props.color};
`;

const NameTag = styled.div`
  position: absolute;
  display: flex;
  padding-left: 4px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-right: 3px;
  z-index: 4;
  left: 10px;
  top: 10px;
  font-size: 13px;
  justify-items: center;
  align-items: center;
  color: white;
  border-radius: 10px;
  background-color: rgba(59, 57, 57, 0.5);
`;
const Control = styled.div`
  position: absolute;
  left: 50%;
  bottom: 5%;
  width: 100%;
  display: flex;
  /* background-color: red; */
  justify-content: center;
  z-index: 3;
  transform: translate(-50%, 0);
`;

const IconButton = styled.button`
  background: transparent;
  border-color: transparent;
`;
