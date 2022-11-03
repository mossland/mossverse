import { useEffect, useRef } from "react";
import { Socket as Soc } from "socket.io-client";
import {
  Chatting,
  WebViewModal,
  MobileController,
  MicController,
  ButtonContainer,
  PlayerClickMenu,
  ProfileModal,
  WalletModal,
} from "./index";
import { Field } from "@shared/ui-web";

import { MyVideo } from "../stream/video";

import styled from "styled-components";

export interface VideoAndAudioSettingProps {
  socket: Soc;
}

export const VideoAndAudioSetting = ({ socket }: VideoAndAudioSettingProps) => {
  const localVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const init = async () => {
      const op: MediaStreamConstraints = {
        video: {
          width: 200,
          height: 130,
          facingMode: "user",
        },

        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(op);

      stream.getAudioTracks()[0].enabled = true;
      stream.getVideoTracks()[0].enabled = true;

      if (localVideo.current) localVideo.current.srcObject = stream;
    };
    init();
  }, []);

  return (
    <StyledVideoAndAudioSetting>
      <div>
        <video className="Video" autoPlay muted ref={localVideo} />
        <div>
          <Field.SelectItem label="Select camera" items={[{ id: "aa", label: "aaa" }]} value="aa" onChange={() => {}} />
          <Field.SelectItem label="Select audio" items={[{ id: "aa", label: "aaa" }]} value="aa" onChange={() => {}} />
          <Field.SelectItem label="Select camera" items={[{ id: "aa", label: "aaa" }]} value="aa" onChange={() => {}} />
        </div>
      </div>
    </StyledVideoAndAudioSetting>
  );
};

const StyledVideoAndAudioSetting = styled.div`
  display: flex;
  justify-content: center;
  items-align: center;
  align-items: center;
  height: 100vh;
`;
