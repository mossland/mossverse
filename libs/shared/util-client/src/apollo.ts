import { ApolloClient, InMemoryCache, DocumentNode, OperationVariables, gql } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { io, Socket } from "socket.io-client";

import { Kaikas, Metamask, Wallet, WalletNetworkType, WalletConnect } from "./wallet";

export type WalletType = "kaikas" | "metamask" | "walletConnect";
export interface Signature {
  signchain: string;
  signmessage: string;
  signaddress: string | string[];
}

export class Client {
  uri = "http://localhost:8080/graphql";
  gql = new ApolloClient({ cache: new InMemoryCache() });
  token = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;
  wallet: Wallet;
  socket: Socket | null = null;
  signature: Signature | null = null;
  signUntil = new Date(0);
  networkType: "mainnet" | "testnet" | "debugnet" = "debugnet";
  async init(uri: string, ws: string | null) {
    return await Promise.all([this.setLink(uri), ...(ws ? [this.setSocket(ws)] : [])]);
  }
  async setSocket(ws: string) {
    // this.socket = io(ws, { transports: ["websocket"] });
    // return new Promise<void>((resolve, reject) => {
    //   this.socket?.on("connect", () => resolve());
    // });
  }
  async setLink(uri: string) {
    this.uri = uri;
    await this.#setup();
  }
  async setToken(token: string) {
    this.token = token;
    localStorage.setItem("currentUser", token);
    await this.#setup();
  }
  setNetworkType(networkType: WalletNetworkType) {
    this.networkType = networkType;
  }
  async setWallet(type: WalletType) {
    if (type === "metamask") this.wallet = await new Metamask(this.networkType).init();
    else if (type === "kaikas") this.wallet = await new Kaikas(this.networkType).init();
    else if (type === "walletConnect") this.wallet = await new WalletConnect(this.networkType).init();
    await this.sign("Connect Wallet");
  }
  async reset() {
    if (this.socket) this.socket.disconnect();
    this.socket = null;
    this.token = null;
    this.signature = null;
    this.signUntil = new Date(0);
    localStorage.removeItem("currentUser");
    await this.#setup();
  }
  async sign(message: string, address?: string) {
    const hash = await encrypt(address ?? (await this.wallet.getAccount()));
    const signmessage = `${message} token:[${hash}] timeStamp:${Date.now()}`;
    this.signature = await this.wallet.sign(signmessage, address);
    this.signUntil = new Date(Date.now() + 1000 * 60 * 10); // 10 mins
    await this.#setup();
  }
  async #setup() {
    const header: any = {};
    if (this.token) header.authorization = `Bearer ${this.token}`;
    // if (this.signature && this.signUntil.getTime() > Date.now()) Object.assign(header, this.signature);
    const link = createUploadLink({
      headers: {
        ...(this.token ? { authorization: `Bearer ${this.token}` } : {}),
        ...(this.signature ?? {}),
      },
      uri: this.uri,
    });
    this.gql.setLink(link);
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
  }
}
const client = new Client();
export default client;

export const mutate = async <Mutation = any>(mutation: DocumentNode, variables?: OperationVariables) => {
  const data = (await client.gql.mutate<Mutation>({ mutation, variables })).data;
  if (!data) throw new Error(`Mutation Failed: ${mutation}`);
  return data;
};
export const query = async <Query = any>(query: DocumentNode, variables?: OperationVariables) => {
  const data = (await client.gql.query<Query>({ query, variables, fetchPolicy: "network-only" })).data;
  if (!data) throw new Error(`Mutation Failed: ${query}`);
  return data;
};

export const encrypt = async (data: string) =>
  (
    await mutate<{ encrypt: string }>(
      gql`
        mutation encrypt($data: String!) {
          encrypt(data: $data)
        }
      `,
      { data }
    )
  ).encrypt;
