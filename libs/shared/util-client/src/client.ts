import graphql from "graphql-tag";
import { AnyVariables, createClient, Client as GqlClient, dedupExchange, cacheExchange } from "@urql/core";
import { io, Socket } from "socket.io-client";
import { Geolocation } from "./router";
import { Kaikas, Metamask, Wallet, WalletNetworkType, WalletConnect } from "./wallet";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import type { DocumentNode } from "graphql";
import { Call } from "./call";

export type WalletType = "kaikas" | "metamask" | "walletConnect";
export interface Signature {
  signchain: string;
  signmessage: string;
  signaddress: string; // | string[];
}

export class Client {
  uri = "http://localhost:8080/graphql";
  gql: GqlClient = createClient({ url: this.uri });
  jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  wallet: Wallet;
  socket: Socket | null = null;
  signature: Signature | null = null;
  geolocation: Geolocation | null = null;
  signUntil = new Date(0);
  networkType: "mainnet" | "testnet" | "debugnet" = "debugnet";
  mediaStream: MediaStream | null;
  screenStream: MediaStream | null;
  videoDevices: MediaDeviceInfo[] = [];
  audioDevices: MediaDeviceInfo[] = [];
  callMap = new Map<string, Call>();

  // localstream =
  async init(uri: string, ws: string | null, data: Partial<Client> = {}) {
    Object.assign(this, data);
    if (!this.jwt) this.jwt = localStorage.getItem("jwt");
    return await Promise.all([this.setLink(uri), ...(ws ? [this.setSocket(ws)] : [])]);
  }

  async setSocket(ws: string) {
    this.socket = io(ws, { transports: ["websocket"] });
    // return new Promise<void>((resolve, reject) => {
    //   this.socket?.on("connect", () => resolve());
    // });
  }
  setLink(uri: string) {
    this.uri = uri;
    this.gql = createClient({
      url: this.uri,
      exchanges: [dedupExchange, cacheExchange, multipartFetchExchange],
      requestPolicy: "network-only",
      fetchOptions: () => {
        return {
          headers: {
            ...(this.jwt ? { authorization: `Bearer ${this.jwt}` } : {}),
            ...(this.signature ?? {}),
            ...(this.geolocation ? { geolocation: JSON.stringify(this.geolocation) } : {}),
          },
        };
      },
    });
  }
  setMediaStream(stream: MediaStream) {
    console.log("setMediaStream", this.mediaStream);
    this.mediaStream = stream;
    console.log(this.mediaStream);
  }
  setVideoDevices(devices: MediaDeviceInfo[]) {
    this.videoDevices = devices;
  }
  setAudioDevices(devices: MediaDeviceInfo[]) {
    this.audioDevices = devices;
  }
  setScreenStream(stream: MediaStream) {
    this.screenStream = stream;
  }
  addCall(userId: string, roomId: string, selfId: string, initiator: boolean) {
    if (!this.mediaStream) return;
    // this.callMap.set(userId, new Call(userId, roomId, selfId, initiator, this.mediaStream, this.screenStream));
  }

  setGeolocation(geolocation: Geolocation) {
    this.geolocation = geolocation;
  }
  setJwt(jwt: string) {
    this.jwt = jwt;
    localStorage.setItem("jwt", jwt);
  }
  setNetworkType(networkType: WalletNetworkType) {
    this.networkType = networkType;
    return this;
  }
  async setWallet(type: WalletType) {
    if (type === "metamask") this.wallet = await new Metamask(this.networkType).init();
    else if (type === "kaikas") this.wallet = await new Kaikas(this.networkType).init();
    else if (type === "walletConnect") this.wallet = await new WalletConnect(this.networkType).init();
    return await this.sign("Connect Wallet");
  }
  reset() {
    if (this.socket) this.socket.disconnect();
    this.socket = null;
    this.jwt = null;
    this.signature = null;
    this.signUntil = new Date(0);
    localStorage.removeItem("jwt");
  }
  async sign(message: string, address?: string) {
    const hash = await encrypt(address ?? (await this.wallet.getAccount()));
    const signmessage = `${message} jwt:[${hash}] timeStamp:${Date.now()}`;
    this.signature = await this.wallet.sign(signmessage, address);
    this.signUntil = new Date(Date.now() + 1000 * 60 * 10); // 10 mins
  }
  async initCall(selfId: string, roomId: string) {
    if (!this.socket) return;

    this.socket.on("introduce", ({ userId }) => {
      if (!this.socket) return;
      //peer 하나추가 해야됨.
      this.addCall(userId, roomId, selfId, false);
      this.socket.emit("welcome", {
        roomId: roomId,
        from: userId,
        userId: selfId,
      });
    });
    this.socket.on("welcome", ({ userId }) => {
      //peer 하나추가 해야됨. initiator false
      this.addCall(userId, roomId, selfId, true);
    });
    this.joinCall(selfId, roomId);
  }
  joinCall(userId: string, roomId: string) {
    if (!this.socket) return;
    this.socket.emit("join", { userId, roomId });
  }
  getCall(id: string) {
    return this.callMap.get(id);
  }
  disableVideoSelf() {
    if (!this.mediaStream) return;
    this.mediaStream.getVideoTracks().forEach((track) => {
      track.enabled = false;
      // track.stop();
      // this.mediaStream?.removeTrack(track);
      // Array.from(this.callMap.keys()).forEach((key) => {
      //   const call = this.getCall(key);
      //   console.log("key", call);

      //   call && this.mediaStream && call.peer.removeTrack(track, this.mediaStream);
      // });
    });
  }
  removeVideoTrack(track: MediaStreamTrack) {
    if (!this.mediaStream) return;
    this.mediaStream.getVideoTracks().forEach((t) => {
      t.enabled = false;
    });
    Array.from(this.callMap.keys()).forEach((key) => {
      const call = this.getCall(key);
      console.log("key", call);

      call && this.mediaStream && call.peer.removeTrack(track, this.mediaStream);
    });

    // this.mediaStream.removeTrack(track);
  }
  addVideoTrack(selfId: string, track: MediaStreamTrack) {
    if (!this.mediaStream) return;
    this.mediaStream.addTrack(track);
    //callMap에 stream emit
    Array.from(this.callMap.keys()).forEach((key) => {
      const call = this.getCall(key);
      console.log("key", call && this.mediaStream);

      if (call && this.mediaStream) {
        console.log("send add track");
        call.peer.addTrack(track, this.mediaStream);
      }
    });
  }
  enableVideoSelf() {
    if (!this.mediaStream) return;
    this.mediaStream.getVideoTracks().forEach((track) => (track.enabled = true));
  }
  disableAudioSelf() {
    if (!this.mediaStream) return;
    this.mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
  }
  enableAudioSelf() {
    if (!this.mediaStream) return;
    this.mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
  }
  disableVideo(id: string) {
    const call = this.getCall(id);
    if (call) call.disableVideoTracks();
  }
  enableVideo(id: string) {
    const call = this.getCall(id);
    if (call) call.enableVideoTracks();
  }
  disableAudio(id: string) {
    const call = this.getCall(id);
    if (call) call.disableAudioTracks();
  }
  enableAudio(id: string) {
    const call = this.getCall(id);
    if (call) call.enableAudioTracks();
  }
  subCallMap(id: string) {
    this.callMap.delete(id);
  }
}
export const client = new Client();

export const mutate = async <Mutation = any>(mutation: DocumentNode, variables: AnyVariables) => {
  const { data, error } = await client.gql.mutation<Mutation>(mutation, variables).toPromise();
  if (!data) throw new Error(`Mutation Failed: ${error?.message}`);
  return data;
};
export const query = async <Query = any>(query: DocumentNode, variables: AnyVariables) => {
  const { data, error } = await client.gql.query<Query>(query, variables).toPromise();
  if (!data) throw new Error(`Query Failed: ${error?.message}`);
  return data;
};

export const encrypt = async (data: string) =>
  (
    await mutate<{ encrypt: string }>(
      graphql`
        mutation encrypt($data: String!) {
          encrypt(data: $data)
        }
      `,
      { data }
    )
  ).encrypt;
