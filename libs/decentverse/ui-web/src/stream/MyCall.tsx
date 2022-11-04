import { useEffect, useRef } from "react";
import { Socket as Soc } from "socket.io-client";
import { store, gql } from "@decentverse/data-access";
import { useInterval } from "@shared/util-client";

import styled from "styled-components";

export interface MyCallProps {
  socket: Soc;
  roomId: string;
}

const videoWidth = 240;
const videoHeight = 280;

export const MyCall = ({ socket, roomId }: MyCallProps) => {
  const self = store.user.use.self();

  const audioTrack = store.callRoom.use.audioTrack();
  const callRoom = store.callRoom.use.callRoom();
  const peers = store.callRoom.use.peers();
  const operateAudioAnalysing = store.callRoom.use.operateAudioAnalysing();
  const stopAudioAnalysing = store.callRoom.use.stopAudioAnalysing();
  const setLocalStream = store.callRoom.use.setLocalStream();
  const setIsTalk = store.callRoom.use.setIsTalk();
  const clearPeers = store.callRoom.use.clearPeers();
  const localVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!self) return;
    getUserMedia().then(() => {
      socket.emit("join", { roomId, userId: self.id, nickName: self.nickname });
    });

    return () => {
      stopAudioAnalysing();
      socket.emit("leave");
      peers.map((peer) => peer.call.peer.destroy());
      clearPeers();
      // store.callRoom.setState({ callRoom: { ...callRoom, roomId: "", roomType: "none", localStream: undefined } });
      setIsTalk(false);
    };
  }, []);

  useInterval(() => {
    for (const peer of peers) {
      if (!peer.call.peer.connected || !self) return;
      const callData = {
        id: self.id,
        cam: callRoom.cam,
        mic: callRoom.mic,
        isTalk: callRoom.mic && callRoom.isTalk,
      };
      peer.call.peer.send(JSON.stringify(callData));
    }
  }, 500);

  if (!self) return <></>;
  const getUserMedia = async () => {
    const op: MediaStreamConstraints = {
      video: false,
      audio: {
        groupId: audioTrack ? audioTrack.id : undefined,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(op);
    console.log(callRoom.mic);
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
