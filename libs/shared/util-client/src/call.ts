import Peer from "simple-peer";
export const stunServer = "stun:stun4.l.google.com:19302";
export class Call {
  initiator: boolean;
  peer: Peer.Instance;
  constructor(initiator: boolean, localStream: MediaStream, screenStream?: MediaStream) {
    this.initiator = initiator;
    this.peer = new Peer({
      initiator: this.initiator,
      streams: [localStream, ...(screenStream ? [screenStream] : [])],
      // trickle: false,
      config: { iceServers: [{ urls: stunServer }] },
    });
  }
  connect(otherId: string) {
    if (!this.peer) return;
    if (this.peer.destroyed) return;
    this.peer.signal(otherId);
  }
}
export type PeerStream = {
  id: string;
  socketId: string;
  nickName: string;
  call: Call;
  mic: number;
  cam: boolean;
  muted: boolean;
  blind: boolean;
  isTalk: boolean;
  quality: number;
};
export type Media = {
  id: string;
  label: string;
};
export type CallBox = {
  roomId: string;
  roomType: "none" | "video" | "call";
  mic: number;
  cam: boolean;
  isTalk: boolean;
  forceMute: boolean;
  fullNum: number;
  localStream?: MediaStream;
  screenStream?: MediaStream;
};
export type InitForm = {
  roomId: string;
  userId: string;
  nickName: string;
};
