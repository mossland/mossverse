import { useEffect, useRef } from "react";
import { Socket as Soc } from "socket.io-client";
import { callRoomStore, userStore } from "../../stores";
import { useInterval } from "@shared/util-client";

import styled from "styled-components";

export interface MyCallProps {
  socket: Soc;
  roomId: string;
}

const videoWidth = 240;
const videoHeight = 280;

export const MyCall = ({ socket, roomId }: MyCallProps) => {
  const self = userStore.use.self();
  if (!self) return <></>;
  const audioTrack = callRoomStore.use.audioTrack();
  const callRoom = callRoomStore.use.callRoom();
  const peers = callRoomStore.use.peers();
  const operateAudioAnalysing = callRoomStore.use.operateAudioAnalysing();
  const stopAudioAnalysing = callRoomStore.use.stopAudioAnalysing();
  const setLocalStream = callRoomStore.use.setLocalStream();
  const setIsTalk = callRoomStore.use.setIsTalk();
  const clearPeers = callRoomStore.use.clearPeers();
  const localVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    getUserMedia().then(() => {
      socket.emit("join", { roomId, userId: self.id, nickName: self.nickname });
    });

    return () => {
      stopAudioAnalysing();
      setIsTalk(false);
      socket.emit("leave");
      peers.map((peer) => peer.call.peer.destroy());
      clearPeers();
      callRoomStore.setState({ callRoom: { ...callRoom, roomId: "", roomType: "none", localStream: undefined } });
    };
  }, []);

  useInterval(() => {
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
      video: false,
      audio: {
        groupId: audioTrack ? audioTrack.id : undefined,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(op);
    stream.getAudioTracks()[0].enabled = callRoom.mic ? true : false;

    // stream.removeTrack(stream.getVideoTracks()[0]);

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

  return (
    <div
      style={{
        position: "absolute",
        left: 10,
        top: 10,
      }}
    >
      <audio className="Video" autoPlay muted ref={localVideo} playsInline />
    </div>
  );
};
