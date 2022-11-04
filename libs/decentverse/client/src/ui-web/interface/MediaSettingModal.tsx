import { MutableRefObject, useEffect, useRef, useState } from "react";
import { userStore, callRoomStore, mapStore, worldStore, useKeyring } from "../../stores";
import { MicOnIcon, MicOffIcon, CamOnIcon, CamOffIcon } from "..";
import { Field } from "@shared/ui-web";
import { ModalContainer } from "@shared/ui-web";
import { darken } from "polished";

import styled from "styled-components";
import { isMobile } from "react-device-detect";

type MediaSettingModal = {
  isShowVideoAudioSetting: boolean;
};

export const MediaSettingModal = ({ isShowVideoAudioSetting }: MediaSettingModal) => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const self = userStore.use.self();
  const initMap = mapStore.use.init();
  const initWorld = worldStore.use.initWorld();
  const callRoom = callRoomStore.use.callRoom();
  const localStream = callRoomStore.use.localStream();
  const audioTrack = callRoomStore.use.audioTrack();
  const videoTrack = callRoomStore.use.videoTrack();
  const videos = callRoomStore.use.videos();
  const audios = callRoomStore.use.audios();
  const setMic = callRoomStore.use.setMic();
  const setCam = callRoomStore.use.setCam();
  const setIsTalk = callRoomStore.use.setIsTalk();

  const setLocalStream = callRoomStore.use.setLocalStream();
  const stopAudioAnalysing = callRoomStore.use.stopAudioAnalysing();
  const operateAudioAnalysing = callRoomStore.use.operateAudioAnalysing();
  useEffect(() => {
    init();
    return () => {
      stopAudioAnalysing();
      setIsTalk(false);
    };
  }, []);

  const init = async () => {
    const op: MediaStreamConstraints = {
      video: {
        width: isMobile ? 130 : 200,
        height: isMobile ? 200 : 130,
        facingMode: "user",
      },
      audio: true,
    };
    const media = await navigator.mediaDevices.getUserMedia(op);
    const video = media.getVideoTracks()[0];
    const audio = media.getAudioTracks()[0];
    video.enabled = callRoom.cam;
    audio.enabled = callRoom.mic ? true : false;
    callRoomStore.setState({
      videoTrack: video ? { id: video.getSettings().groupId as string, label: video.label } : null,
      audioTrack: audio ? { id: audio.getSettings().groupId as string, label: audio.label } : null,
    });

    if (localVideo.current) localVideo.current.srcObject = media;
    setLocalStream(media);
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(media);
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
  };

  const onClickSubmit = async () => {
    await initMap("game");
    self && (await initWorld(self));
    callRoomStore.setState({ callRoom: { ...callRoom, localStream: undefined } });
    close();
  };

  const close = () => {
    useKeyring.setState({ loginMethod: "none" });
    userStore.setState({ isShowVideoAudioSetting: false });
  };

  const toggleMyCam = async () => {
    const cam = !callRoom.cam;
    setCam(cam);
  };

  const toggleMyMic = async () => {
    const mic = callRoom.mic ? 0 : 100;
    setMic(mic);
  };
  return (
    <ModalContainer showModal={isShowVideoAudioSetting} closeShowModal={close} opacity="0.5" title="Voice & Video">
      <SettingContainer>
        <div className="video-container">
          {!callRoom.cam && <div className="empty-video" />}
          <div className="backlight" style={{ backgroundColor: callRoom.isTalk ? "#9ACD32" : "transparent" }} />
          <video className="Video" autoPlay muted ref={localVideo} playsInline />
          <div className="buttons">
            <div className="button" onClick={toggleMyMic}>
              {callRoom.mic ? <MicOnIcon /> : <MicOffIcon />}
            </div>
            <div className="button" onClick={toggleMyCam}>
              {callRoom.cam ? <CamOnIcon /> : <CamOffIcon />}
            </div>
          </div>
        </div>
        {/* <div className="select-area">
          <Field.SelectItem
            label="Select camera"
            items={videos}
            value={videoTrack ? videoTrack?.label : ""}
            onChange={(value) => {
              const video = videos.find((audio) => audio.id === value);
              callRoomStore.setState({ videoTrack: video });
            }}
          />
          <Field.SelectItem
            label="Select audio"
            items={audios}
            value={audioTrack ? audioTrack?.label : ""}
            onChange={(value) => {
              console.log(audios);
              const audio = audios.find((audio) => audio.id === value);
              callRoomStore.setState({ audioTrack: audio });
            }}
          />
        </div> */}
        <Submit onClick={onClickSubmit}>Done</Submit>
        <StateManagement videoStream={localVideo} />
      </SettingContainer>
    </ModalContainer>
  );
};
const StateManagement = ({ videoStream }: { videoStream: React.RefObject<HTMLVideoElement> }) => {
  const setLocalStream = callRoomStore.use.setLocalStream();

  useEffect(() => {
    getCurrentMedias();
    navigator.mediaDevices.ondevicechange = async (event) => {
      await getCurrentMedias();
    };
  }, []);
  const getCurrentMedias = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    const audioDevices = devices.filter((device) => device.kind === "audioinput");

    const defaultVideo =
      videoDevices.length === 1 ? videoDevices[0] : videoDevices.find((device) => device.deviceId === "default");
    const defaultAudio = audioDevices.find((device) => device.deviceId === "default");
    if (!defaultAudio || !defaultVideo) return;
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { groupId: defaultVideo.groupId, width: 200, height: 130, facingMode: "user" },
      audio: { groupId: defaultAudio.groupId },
    });
    if (videoStream.current) videoStream.current.srcObject = newStream;

    setLocalStream(newStream);
    callRoomStore.setState({
      audios: devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => ({ id: device.groupId, label: device.label })),
      videos: devices
        .filter((device) => device.kind === "videoinput")
        .map((device) => ({ id: device.groupId, label: device.label })),
      videoTrack: { id: defaultVideo.groupId, label: defaultVideo.label },
      audioTrack: { id: defaultAudio.groupId, label: defaultAudio.label },
    });
  };

  return <></>;
};

const SettingContainer = styled.div`
  /* display: flex; */
  padding: 26px 22px;
  gap: 10px;

  .Video {
    display: flex;
    flex-wrap: wrap;
    width: 198px;
    height: 130px;
    align-content: center;
    justify-content: center;
    border-radius: 10px;
    /* z-index: 2; */
    -webkit-transform: rotateY(180deg); /* Safari and Chrome */
    transform: rotateY(180deg);
    -moz-transform: rotateY(180deg); /* Firefox */
  }
  .video-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-bottom: 18px;
    /* gap: 4px; */
    /* transform: translateX(15px); */
  }
  .backlight {
    position: absolute;
    /* top: 0; */
    align-self: center;
    width: 210px;
    height: 140px;
    z-index: 0;
    /* border: 2px solid #000; */
    border-radius: 10px;

    /* background-color: red; */
    /* position: absolute;
    width: 220px;
    height: 150px;
    border-radius: 8px;
    z-index: 4;*/
  }
  .empty-video {
    position: absolute;
    top: 0;
    width: 198px;
    height: 130px;
    z-index: 1;
    border: 2px solid #000;
    border-radius: 10px;

    background-color: #888888;
  }
  .buttons {
    display: flex;
    gap: 26px;
    position: absolute;
    bottom: 14px;
    z-index: 2;
    /* background-color: red; */
    .button {
      /* margin-top: 4px; */
      cursor: pointer;
      svg {
        -webkit-filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.4));
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.4));
      }
    }
  }

  video {
    border: 2px solid #000;
    border-radius: 10px;
    @media screen and (max-width: 800px) {
      width: 130px;
      height: 198px;
    }
  }
  video::-webkit-media-controls-panel {
    background-image: none !important;
  }

  .select-area {
    width: 100%;
    .label {
      font-size: 16px;
      text-align: left;
    }
    .ant-space {
      display: inline-block;
    }
    .ant-space-item {
      /* background-color: blue; */
      font-size: 1px;
      margin: 0;
      padding: 0;
    }
    .ant-select {
      width: 100%;
      font-size: 14px;
      border: 2px solid #000;
      border-radius: 10px;
      overflow: hidden;
      text-align: left;
      background-color: rgba(255, 255, 255, 0.7);
    }
    .ant-select-arrow {
      color: black;
    }
    .ant-space.ant-space-horizontal.ant-space-align-center {
      width: 100%;
    }
  }
`;

const Submit = styled.div`
  display: block;
  width: 100%;
  padding: 10px;
  /* margin: 1px 0; */
  font-size: 22px;
  color: #000;
  background-color: #66fef0;
  text-align: center;
  border-radius: 10px;
  transition: 0.5s;
  border: 2px solid #000;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.3, "#66fef0")};
  }
`;
