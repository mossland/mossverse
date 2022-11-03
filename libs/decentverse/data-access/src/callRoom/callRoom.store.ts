/* eslint-disable @typescript-eslint/no-var-requires */
import axios from "axios";
import create from "zustand";
import { Call, CallBox, DefaultOf, generateStore, InitForm, Media, Nullable, PeerStream } from "@shared/util-client";
import * as gql from "../gql";
import { cnst } from "@shared/util";

type State = DefaultOf<gql.CallRoom> & {
  isWebviewOpen: boolean;
  audioTrack: Media | null;
  videoTrack: Media | null;
  audios: Media[];
  videos: Media[];
  CALLROOM: gql.CallRoom | null;
  callRoom: CallBox;
  peers: PeerStream[];
  analyzeInterval?: NodeJS.Timer;
  localStream: MediaStream | null;
  operation: "sleep" | "idle" | "loading";
};

const initialState: State = {
  ...gql.defaultCallRoom,
  isWebviewOpen: true,
  audios: [],
  videos: [],
  audioTrack: null,
  videoTrack: null,
  CALLROOM: null, // 아래 callRoom과 체인지 예정
  callRoom: {
    roomId: "",
    roomType: "none",
    mic: 100,
    forceMute: false,
    isTalk: false,
    cam: false,
    fullNum: 0,
  },
  localStream: null,
  peers: [],
  operation: "sleep",
};

type Action = {
  forceMute: () => void;
  joinCallRoom: (roomId: string, roomType: cnst.RoomType) => void;
  leaveCallRoom: () => void;
  addPeer: (
    socketId: string,
    initiator: boolean,
    form: InitForm,
    localStream: MediaStream,
    screenStream?: MediaStream
  ) => void;
  updatePeer: (data: Partial<PeerStream>) => void;
  removePeer: (id: string) => void;
  setIsTalk: (isTalk: boolean) => void;
  setMic: (mic: number) => void;
  setCam: (cam: boolean) => void;
  toggleMic: () => void;
  toggleCam: () => void;
  mutePeer: (id: string) => void;
  unmutePeer: (id: string) => void;
  blindPeer: (id: string) => void;
  openPeer: (id: string) => void;
  clearPeers: () => void;
  isRoomInUser: (otherPlayerNickname: string) => boolean;
  operateAudioAnalysing: (callback: () => void) => void;
  stopAudioAnalysing: () => void;
  togglePeerMic: (peerId: string, mic: boolean) => void;
  togglePeerCam: (peerId: string, cam: boolean) => void;
  setLocalStream: (localStream: MediaStream) => void;
  toggleScreen: (screenStream: MediaStream) => void;
  get: () => gql.CallRoom;
};
const store = create<State & Action>((set, get) => ({
  ...initialState,
  forceMute: () => {
    const localStream = get().callRoom.localStream;
    localStream?.getAudioTracks().forEach((track) => (track.enabled = false));
    set((state) => ({ callRoom: { ...state.callRoom, mic: 0, forceMute: true } }));
  },
  isRoomInUser: (playerId: string) => {
    const peers = get().peers;
    return peers.find((peer) => peer.id === playerId) ? true : false;
  },

  operateAudioAnalysing: (callback: () => void) => {
    const intervalId = setInterval(callback, 300);
    set({ analyzeInterval: intervalId });
  },

  stopAudioAnalysing: () => {
    const { analyzeInterval, callRoom } = get();
    console.log(analyzeInterval);
    clearInterval(analyzeInterval);
    set({ analyzeInterval: undefined, callRoom: { ...callRoom, isTalk: false } });
  },

  joinCallRoom: (roomId: string, roomType: cnst.RoomType) => {
    set((state) => ({ callRoom: { ...state.callRoom, roomType, roomId } }));
  },
  leaveCallRoom: () =>
    set((state) => ({ callRoom: { ...state.callRoom, roomId: "", roomType: "none", isTalk: false } })),

  addPeer: (
    socketId: string,
    initiator: boolean,
    form: InitForm,
    localStream: MediaStream,
    screenStream?: MediaStream
  ) =>
    set((state) => ({
      callRoom: {
        ...state.callRoom,
        roomId: form.roomId,
        localStream,
        screenStream,
      },
      peers: [
        ...state.peers,
        {
          id: form.userId,
          socketId,
          nickName: form.nickName,
          mic: 100,
          isTalk: false,
          muted: false,
          blind: false,
          cam: false,
          quality: 100,
          call: new Call(initiator, localStream, screenStream),
        },
      ],
    })),
  removePeer: (id: string) =>
    set((state) => {
      const peers = state.peers.filter((p) => p.id !== id);

      return { peers };
    }),
  clearPeers: () =>
    set((state) => {
      return { peers: [] };
    }),
  setMic: (mic: number) =>
    set((state) => {
      // if (!state.callRoom.localStream) return {};
      if (state.callRoom.localStream && state.callRoom.localStream.getAudioTracks().length > 0)
        state.callRoom.localStream.getAudioTracks().forEach((track) => (track.enabled = mic ? true : false));
      return { callRoom: { ...state.callRoom, mic } };
    }),

  setCam: (cam: boolean) =>
    set((state) => {
      if (!state.callRoom.localStream) return {};
      if (state.callRoom.localStream.getVideoTracks().length > 0)
        state.callRoom.localStream.getVideoTracks().forEach((track) => (track.enabled = cam));
      return { callRoom: { ...state.callRoom, cam } };
    }),

  mutePeer: (id: string) =>
    set((state) => {
      return { peers: state.peers.map((peer) => (peer.id !== id ? peer : Object.assign(peer, { muted: true }))) };
    }),

  blindPeer: (id: string) =>
    set((state) => {
      return { peers: state.peers.map((peer) => (peer.id !== id ? peer : Object.assign(peer, { blind: true }))) };
    }),

  unmutePeer: (id: string) =>
    set((state) => {
      return { peers: state.peers.map((peer) => (peer.id !== id ? peer : Object.assign(peer, { muted: false }))) };
    }),

  openPeer: (id: string) =>
    set((state) => {
      return { peers: state.peers.map((peer) => (peer.id !== id ? peer : Object.assign(peer, { blind: false }))) };
    }),

  toggleMic: () =>
    set((state) => {
      if (!state.callRoom.localStream) return {};
      if (state.callRoom.localStream.getAudioTracks().length > 0)
        state.callRoom.localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      return { callRoom: { ...state.callRoom, mic: state.callRoom.mic ? 0 : 100 } };
    }),
  toggleCam: () =>
    set((state) => {
      if (!state.callRoom.localStream) return {};
      if (state.callRoom.localStream.getVideoTracks().length > 0)
        state.callRoom.localStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      return { callRoom: { ...state.callRoom, cam: !state.callRoom.cam } };
    }),
  togglePeerMic: (id: string, mic: boolean) =>
    set((state) => {
      return {
        peers: state.peers.map((peer) => (peer.id !== id ? peer : Object.assign(peer, { mic: mic ? 100 : 0 }))),
      };
    }),
  togglePeerCam: (id: string, cam: boolean) =>
    set((state) => {
      return { peers: state.peers.map((peer) => (peer.id !== id ? peer : Object.assign(peer, { cam }))) };
    }),
  setIsTalk: (isTalk: boolean) => {
    set((state) => {
      state.callRoom.isTalk = isTalk && state.callRoom.mic > 0;
      return { callRoom: { ...state.callRoom } };
    });
  },
  updatePeer: (data: Partial<PeerStream>) =>
    set((state) => {
      state.peers = state.peers.map((peer) => (peer.id !== data.id ? peer : Object.assign(peer, data)));
      return { peers: state.peers.map((peer) => (peer.id !== data.id ? peer : Object.assign(peer, data))) };
    }),
  setLocalStream: (localStream: MediaStream) => set((state) => ({ callRoom: { ...state.callRoom, localStream } })),
  toggleScreen: (screenStream: MediaStream) => {
    const callRoom = get().callRoom;
    if (callRoom.forceMute) return;
    const stream = callRoom.screenStream;
    return stream
      ? set((state) => {
          state.peers.map((p) => state.callRoom.screenStream && p.call.peer.removeStream(state.callRoom.screenStream));
          return { callRoom: { ...state.callRoom, screenStream: undefined } };
        })
      : set((state) => {
          state.peers.map((p) => p.call.peer.addStream(screenStream));
          return { callRoom: { ...state.callRoom, screenStream } };
        });
  },
  get: () => ({
    // 임시 기능
    id: "",
    message: "message",
    errorMessage: "error",
    center: [0, 0],
    wh: [0, 0],
    maxNum: 10,
    roomType: "call",
  }),
}));

export const callRoom = generateStore(store);
